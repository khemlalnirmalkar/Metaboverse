/*
Metaboverse
Metaboverse is designed for analysis of metabolic networks
https://github.com/Metaboverse/Metaboverse/
alias: metaboverse

Copyright (C) 2019-2020 Jordan A. Berg
Email: jordan<dot>berg<at>biochem<dot>utah<dot>edu

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with
this program.  If not, see <https://www.gnu.org/licenses/>.
*/

const { ipcRenderer } = require("electron");
var $ = require("jquery");
var reactome_api = "https://reactome.org/ContentService/data/species/all";

window.addEventListener("load", function(event) {
  event.preventDefault();
  event.stopPropagation();

  $.ajax({
    url: "../__version__.txt",
    success: function(version) {
      $.getJSON("https://api.github.com/repos/Metaboverse/Metaboverse/tags", function(d) {
        let _v = String(version.trim().replace(/[^0-9.]/g,''))
        let avail_versions = [];
        for (_k in d) {
          avail_versions.push(String(d[_k].name.trim().replace(/[^0-9.]/g,'')))
        }
        avail_versions = avail_versions.sort();
        let _c = avail_versions[avail_versions.length - 1]
        if (_c !== _v) {
          alert("A more current version of Metaboverse is available: " + _c)
        }
      })
    }
  });

  update_session_info("current_pathway", null);

  $('#content').append('<a href="curate.html"><div id="continue"><font size="3">Skip</font></div></a>');

  var dbURL = get_session_info("database_url");
  var defaultValue = "No file selected";
  if (dbURL !== null) {
    defaultValue = dbURL;
    $("#content").html(
      '<a href="motif.html"><div id="continue"><font size="3">View Motif Analysis</font></div></a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="visualize.html"><div id="continue"><font size="3">Visualize</font></div></a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="connections.html"><div id="continue"><font size="3">Connectivity</font></div></a></br></br><a href="curate.html"><div id="continue"><font size="3">Skip</font></div></a>'
    );
  }
  $('#selectedFile').append('<font size="2">' + defaultValue + '</font>');

  document.getElementById("menurefresh").onclick = function(event) {
    event.preventDefault();
    event.stopPropagation();

    refresh_session()
  }

  document.getElementById("dropDatabase").onclick = function(event) {
    event.preventDefault();
    event.stopPropagation();

    document.getElementById('database-input').click();
  }

  document.getElementById("database-input").onchange = function(event) {
    event.preventDefault();
    event.stopPropagation();

    var inputVal = document.getElementById("database-input").value.split(".");
    console.log(inputVal[inputVal.length - 1])
    if (inputVal[inputVal.length - 1] !== "json") {
      alert(
        "Input is not a .json file. You must upload the correct file type for the analyses to work."
      );

    } else {
      try {
        f = event.srcElement.files[0];
        console.log("The file you dragged: ", f.path);
        update_session_info("database_url", f.path);
        update_session_info("processed", true);
        $('#selectedFile').html('<font size="2">' + f.path + '</font>');
        var data = JSON.parse(fs.readFileSync(f.path).toString());
        if (data.categories.length > 0) {
          $("#content").html(
            '<a href="motif.html"><div id="continue"><font size="3">View Motif Analysis</font></div></a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="visualize.html"><div id="continue"><font size="3">Visualize</font></div></a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="connections.html"><div id="continue"><font size="3">Connectivity</font></div></a></br></br><a href="curate.html"><div id="continue"><font size="3">Skip</font></div></a>'
          );
        } else {
          $("#content").html(
            '<a href="visualize.html"><div id="continue"><font size="3">Visualize</font></div></a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="connections.html"><div id="continue"><font size="3">Connectivity</font></div></a></br></br><a href="curate.html"><div id="continue"><font size="3">Skip</font></div></a>'
          );
        }
        // Load session data values into current session
        var abbreviation_dict = {};
        $.getJSON(reactome_api, function(d) {
          d.forEach(function(datum) {
            abbreviation_dict[datum["abbreviation"]] = datum["displayName"];
          });
          update_session_info("organism",
            abbreviation_dict[data.metadata.species_id]);
        });
        update_session_info("curation_url", data.metadata.organism_curation);
        update_session_info("output", data.metadata.output);
        update_session_info("organism_id", data.metadata.species_id);
        update_session_info("transcriptomics", data.metadata.transcriptomics);
        update_session_info("proteomics", data.metadata.proteomics);
        update_session_info("metabolomics", data.metadata.metabolomics);
        update_session_info("experiment_name", data.metadata.experiment_name);
        update_session_info("experiment_type", data.metadata.experiment_type);
        update_session_info("max_value", data.metadata.max_value);
        update_session_info("max_stat", data.metadata.max_stat);
        update_session_info("processed", true);
        update_session_info("collapseWithModifiers",
          data.metadata.collapse_with_modifiers);
        update_session_info("broadcastGeneExpression",
          data.metadata.broadcastGeneExpression);
        update_session_info("labels", data.metadata.labels);
        update_session_info("blocklist", data.metadata.blocklist);
        update_session_info("database_date", data.metadata.database_date);
        update_session_info("curation_date", data.metadata.curation_date);
        update_session_info("reactome_version", data.metadata.reactome_version);

      } catch (error) {
        console.log(error);
        alert(
          "Unable to load provided file into session info."
        );
        window.location.reload(false);
      }
    }
  };
});

ipcRenderer.on("file-input", (event, data) => {
  $("#file-input").text(data);
});
