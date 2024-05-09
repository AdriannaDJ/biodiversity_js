// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    var metadataSet = data.metadata;

    // Filter the metadata for the object with the desired sample number
    var result = metadataSet.filter(samp => samp.id == sample);

    // Use d3 to select the panel with id of `#sample-metadata`
    var panelId = d3.select('#sample-metadata');

    // Use `.html("") to clear any existing metadata
    panelId.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    result.forEach((sample) => {
      Object.entries(sample).forEach(([key, value]) => {
        panelId.append("p").text(`${key}: ${value}`);
  });
});
  });
} 

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    var sampField = data.samples;

    // Filter the samples for the object with the desired sample number
    var filteredSamp = sampField.filter(samp => samp.id == sample);

    // Get the otu_ids, otu_labels, and sample_values
    var otuIds = filteredSamp[0].otu_ids;
    var otuLabels = filteredSamp[0].otu_labels;
    var sampValues = filteredSamp[0].sample_values;

    // Build a Bubble Chart
    var trace1 = {
      x: otuIds,
      y: sampValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampValues,
        color: otuIds
      }
    };

    // checking if arrays have data
    // console.log("otuIds:", otuIds);
    // console.log("sampValues:", sampValues);
    // console.log("otuLabels:", otuLabels);

    var layout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: {title: 'OTU ID'},
      xaxis: {title: 'Number of Bacteria'}
    };

    // Render the Bubble Chart
    Plotly.newPlot('bubble', trace1, layout);


    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    var otuIdsTicks = otuIds.map(item => `OTU ${item}`); 

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately (top 10)
    var trace2 = [
      {
        type: 'bar',
        orientation: 'h',
        x: sampValues.slice(0, 10).reverse(),
        y: otuIdsTicks.slice(0, 10).reverse(),
        text: otuLabels.slice(0, 10).reverse()
      }
    ];

    var layout = {
      title: 'Top 10 Bacteria Cultures Found',
      xaxis: {title: 'Number of Bacteria'}
    };

    // Render the Bar Chart
    Plotly.newPlot('bar', trace2, layout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    var sampName = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    var dropDownId = d3.select('#selDataset')

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    sampName.forEach((sampleId) => {
      dropDownId.append("option").text(sampleId).attr("value", sampleId);
    });

    // Get the first sample from the list
    var firstSamp = sampName[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(firstSamp);
    buildCharts(firstSamp);
  });
  };

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();