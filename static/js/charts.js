function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
   
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
        // Use the first sample from the list to build the initial plots
        var firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
})}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}
// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    var metadata = data.metadata;
    
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    //  5. Create a variable that holds the first sample in the array.
    var resultSample = samples.filter(sampleObj => sampleObj.id == sample)[0];
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    // 3. Create a variable that holds the washing frequency.
    var wfreq = metadata.filter(sampleObj => sampleObj.id == sample)[0].wfreq;   
    var wfreqFloat = parseFloat(wfreq);
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = resultSample.otu_ids
    var otu_labels = resultSample.otu_labels
    var sample_values = resultSample.sample_values
    
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = []
    var ticks = otu_ids.map(sample => sample).slice(0,10).reverse()
    ticks.forEach((tick) => {yticks.push('OTU '+tick)});

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sample_values.slice(0,10).reverse(),
      text: otu_labels.map(String).reverse(),
      type: "bar",

    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      yaxis: {tickmode: "array",
      tickvals: [0,1,2,3,4,5,6,7,8,9,10],
      ticktext: yticks.map(String)},
      plot_bgcolor:"#B0CADF",
      paper_bgcolor:"#B0CADF"
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar-plot", barData, barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels.map(String),
      mode: 'markers',
      marker:{
        size: sample_values,
        color: otu_ids,
        colorscale: 'Jet' 
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      plot_bgcolor:"#B0CADF",
      paper_bgcolor:"#B0CADF"
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: wfreqFloat,
      type: "indicator",
      mode: "gauge+number",
      title: {
        text: "<b>Belly Button Washing Frequency</b><br> Scrubs per Week"
       },
      gauge:{
        
        axis: { range: [0, 10] , tickvals: [0, 2, 4, 6, 8, 10]},
        bar: {color: 'black'},
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "lawngreen" },
          { range: [8, 10], color: "green" }
        ],
      }
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      plot_bgcolor:"#B0CADF",
      paper_bgcolor:"#B0CADF"
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
 

  });
}

 