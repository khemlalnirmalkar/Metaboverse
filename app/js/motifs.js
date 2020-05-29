/*
Metaboverse
Metaboverse is designed for analysis of metabolic networks
https://github.com/Metaboverse/Metaboverse/
alias: metaboverse

Copyright (C) 2019  Youjia Zhou, Jordan A. Berg
  zhou325 <at> sci <dot> utah <dot> edu
  jordan <dot> berg <at> biochem <dot> utah <dot> edu

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

var eval_modifiers = false;
var excl_hubs = false;
var hub_threshold = 100;

function modifiersChecked() {
  if (eval_modifiers === false) {
    eval_modifiers = true;
  } else {
    eval_modifiers = false;
  }
  console.log("Motif evaluation includes modifiers: ", eval_modifiers)
}

function hubsChecked() {
  if (excl_hubs === false) {
    excl_hubs = true;
  } else {
    excl_hubs = false;
  }
  console.log("High hub exlusion (more than", hub_threshold, "connections): ", excl_hubs)
}

function cleanHubs(
    excl_hubs,
    components,
    degree_dict,
    hub_threshold) {

  let filtered_hubs = components.filter(x => degree_dict[x] <= hub_threshold);
  return filtered_hubs;
}

function parseComponents(
    reaction,
    expression_dict,
    degree_dict,
    sample_index) {

  let reactants = reaction.reactants;
  let products = reaction.products;
  let modifiers = reaction.modifiers;

  let source_expression = [];
  let target_expression = [];

  let temp_reactants = $.extend(true, [], reactants);
  let temp_products = $.extend(true, [], products);

  if (eval_modifiers === true) {
    for (x in modifiers) {
      if (modifiers[x][1] === "catalyst") {
        temp_reactants.push(modifiers[x][0])
      } else if (modifiers[x][1] === "inhibitor") {
        temp_reactants.push(modifiers[x][0])
      } else {}
    }
  }

  let clean_reactants = [];
  let clean_products = [];
  if (excl_hubs === true) {
    clean_reactants = cleanHubs(
      excl_hubs,
      temp_reactants,
      degree_dict,
      hub_threshold)
    clean_products = cleanHubs(
      excl_hubs,
      temp_products,
      degree_dict,
      hub_threshold)
  } else {
    clean_reactants = temp_reactants;
    clean_products = temp_products;
  }

  clean_reactants.forEach(l=>{
    let reactant_expr = expression_dict[l][sample_index];
    if(reactant_expr !== null){
      source_expression.push(parseFloat(reactant_expr));
    }
  })

  clean_products.forEach(l=>{
    let product_expr = expression_dict[l][sample_index];
    if(product_expr !== null){
      target_expression.push(parseFloat(product_expr));
    }
  })

  let updated_source = source_expression.filter(function(value) {
      return !Number.isNaN(value);
  });
  let updated_target = target_expression.filter(function(value) {
      return !Number.isNaN(value);
  });

  return [updated_source, updated_target]
}

function parseComponentsMod(
    reaction,
    expression_dict,
    degree_dict,
    sample_index) {

  let core = reaction.reactants.concat(reaction.products);
  let modifiers = reaction.modifiers;

  let core_expression = [];
  let mods_expression = [];

  let temp_core = $.extend(true, [], core);
  let temp_mods = $.extend(true, [], modifiers);

  let clean_core = [];
  let clean_modifiers = [];
  if (excl_hubs === true) {
    clean_core = cleanHubs(
      excl_hubs,
      temp_core,
      degree_dict,
      hub_threshold)
    temp_mods = temp_mods.map(x => x[0]);
    clean_modifiers = cleanHubs(
      excl_hubs,
      temp_mods,
      degree_dict,
      hub_threshold)
  } else {
    clean_core = temp_core;
    clean_modifiers = temp_mods.map(x => x[0]);
  }

  clean_core.forEach(l=>{
    let core_expr = expression_dict[l][sample_index];
    if(core_expr !== null){
      core_expression.push(parseFloat(core_expr));
    }
  })

  clean_modifiers.forEach(l=>{
    let mod_expr = expression_dict[l][sample_index];
    if(mod_expr !== null){
      mods_expression.push(parseFloat(mod_expr));
    }
  })

  let updated_core = core_expression.filter(function(value) {
      return !Number.isNaN(value);
  });
  let updated_mods = mods_expression.filter(function(value) {
      return !Number.isNaN(value);
  });

  return [updated_core, updated_mods]
}

function parseComponentsTrans(
    reaction,
    expression_dict,
    degree_dict,
    sample_index) {

  let reactants = reaction.reactants;
  let products = reaction.products;
  let modifiers = reaction.modifiers;

  let source_expression = [];
  let target_expression = [];
  let modifier_expression = [];

  let temp_reactants = $.extend(true, [], reactants);
  let temp_products = $.extend(true, [], products);
  let temp_modifiers = $.extend(true, [], modifiers);

  let clean_reactants = [];
  let clean_products = [];
  let clean_modifiers = [];
  if (excl_hubs === true) {
    clean_reactants = cleanHubs(
      excl_hubs,
      temp_reactants,
      degree_dict,
      hub_threshold)
    clean_products = cleanHubs(
      excl_hubs,
      temp_products,
      degree_dict,
      hub_threshold)
    parse_modifiers = temp_modifiers.map(x => x[0]);
    clean_modifiers = cleanHubs(
      excl_hubs,
      parse_modifiers,
      degree_dict,
      hub_threshold)
  } else {
    clean_reactants = temp_reactants;
    clean_products = temp_products;
    clean_modifiers = temp_modifiers.map(x => x[0]);
  }

  clean_reactants.forEach(l=>{
    let reactant_expr = expression_dict[l][sample_index];
    if(reactant_expr !== null){
      source_expression.push(parseFloat(reactant_expr));
    }
  })

  clean_products.forEach(l=>{
    let product_expr = expression_dict[l][sample_index];
    if(product_expr !== null){
      target_expression.push(parseFloat(product_expr));
    }
  })

  clean_modifiers.forEach(l=>{
    let modifier_expr = expression_dict[l][sample_index];
    if(modifier_expr !== null){
      modifier_expression.push(parseFloat(modifier_expr));
    }
  })

  let updated_source = source_expression.filter(function(value) {
      return !Number.isNaN(value);
  });
  let updated_target = target_expression.filter(function(value) {
      return !Number.isNaN(value);
  });
  let updated_modifier = modifier_expression.filter(function(value) {
      return !Number.isNaN(value);
  });

  return [updated_source, updated_target, updated_modifier]
}


function computeAvg(arr){
  let arr_sum = arr[0];
  for(let i=1; i<arr.length; i++){
    arr_sum += arr[i];
  }
  let arr_avg = arr_sum / arr.length;
  return arr_avg;
}

// search for motif 1
//let threshold = d3.select("#avg_num").node().value;
function motifSearch_Avg(
      threshold,
      collapsed_reaction_dict,
      expression_dict,
      path_mapper,
      value_type,
      stats_dict,
      modifiers
      degree_dict,
      sample_indices) {
  console.log("motif search 1")
  console.log("Avg threshold set at: ", threshold)
  console.log(value_type)
  console.log(expression_dict)
  let discovered_motifs = [];

  for (_idx in sample_indices) {
    let sample_motifs = [];

    for(let rxn in collapsed_reaction_dict) {
      let reaction = collapsed_reaction_dict[rxn];
      let comps = parseComponents(
        reaction,
        expression_dict,
        degree_dict,
        _idx)
      let updated_source = comps[0];
      let updated_target = comps[1];

      if(updated_source.length>0 && updated_target.length>0){
        let source_avg = computeAvg(updated_source);
        let target_avg = computeAvg(updated_target);

        if(Math.abs(source_avg - target_avg)>=threshold){
          // get p-values
          let p_source;
          let p_target;
          if (value_type === "Expression Values"){
            let stats_comps = parseComponents(
              reaction,
              stats_dict);
            if(stats_comps[0].length > 0){
              p_source = Math.min(...stats_comps[0]);
            } else {
              p_source = 1.01; // It should be "null", but for sorting purpose, I cheat a little bit by setting the value to be 1.01.
            }
            if(stats_comps[1].length > 0){
              p_target = Math.min(...stats_comps[1]);
            } else {
              p_target = 1.01;
            }

          } else { // value_type === "Stats"
            p_source = Math.min(...updated_source);
            p_target = Math.min(...updated_target);
          }
          reaction.p_values = {"source":p_source, "target":p_target};
          reaction.magnitude_change = Math.abs(source_avg - target_avg);
          if(Math.abs(source_avg - target_avg)>=threshold){
            sample_motifs.push(reaction);
          }
      }
    }
    for (let m in sample_motifs) {
      sample_motifs[m]['pathways'] = path_mapper[sample_motifs[m]['id']]
    }
    discovered_motifs.push(sample_motifs);
  }
  console.log(discovered_motifs);
  return discovered_motifs;
}

// MaxMax
//let threshold = d3.select("#maxmax_num").node().value;
function motifSearch_MaxMax(
    threshold,
    collapsed_reaction_dict,
    expression_dict,
    path_mapper,
    value_type,
    stats_dict,
    modifiers
    degree_dict,
    sample_indices) {
  console.log("motif search 2")
  console.log("MaxMax threshold set at: ", threshold)
  let discovered_motifs = [];

  for (_idx in sample_indices) {
    let sample_motifs = [];

    for(let rxn in collapsed_reaction_dict){
      let reaction = collapsed_reaction_dict[rxn];
      let comps = parseComponents(
        reaction,
        expression_dict,
        degree_dict,
        _idx)
      let updated_source = comps[0];
      let updated_target = comps[1];

      if(updated_source.length>0 && updated_target.length>0){
        let source_max = Math.max(...updated_source);
        let target_max = Math.max(...updated_target);
        if(Math.abs(source_max - target_max)>=threshold){
          // get p-values
          let p_source;
          let p_target;
          if (value_type === "Expression Values"){
            let stats_comps = parseComponents(
              reaction,
              stats_dict);
            if(stats_comps[0].length > 0){
              p_source = Math.min(...stats_comps[0]);
            } else {
              p_source = 1.01; // It should be "null", but for sorting purpose, I cheat a little bit by setting the value to be 1.01.
            }
            if(stats_comps[1].length > 0){
              p_target = Math.min(...stats_comps[1]);
            } else {
              p_target = 1.01;
            }

          } else { // value_type === "Stats"
            p_source = Math.min(...updated_source);
            p_target = Math.min(...updated_target);
          }
          reaction.p_values = {"source":p_source, "target":p_target};
          reaction.magnitude_change = Math.abs(source_max - target_max);
          sample_motifs.push(reaction);

      }
    }
    for (let m in sample_motifs) {
      sample_motifs[m]['pathways'] = path_mapper[sample_motifs[m]['id']]
    }
    discovered_motifs.push(sample_motifs);
  }
  console.log(discovered_motifs);
  return discovered_motifs;
}

//MaxMin
//let threshold = d3.select("#maxmin_num").node().value;
function motifSearch_MaxMin(
    threshold,
    collapsed_reaction_dict,
    expression_dict,
    path_mapper,
    value_type,
    stats_dict,
    modifiers
    degree_dict,
    sample_indices) {
  console.log("motif search 3")
  console.log("MaxMin threshold set at: ", threshold)
  let discovered_motifs = [];

  for (_idx in sample_indices) {
    let sample_motifs = [];

    for(let rxn in collapsed_reaction_dict){
      let reaction = collapsed_reaction_dict[rxn];
      let comps = parseComponents(
        reaction,
        expression_dict,
        degree_dict,
        _idx)
      let updated_source = comps[0];
      let updated_target = comps[1];

      if(updated_source.length>0 && updated_target.length>0){
        let source_max = Math.max(...updated_source);
        let target_min = Math.min(...updated_target);
        if(Math.abs(source_max - target_min)>=threshold){
          // get p-values
          let p_source;
          let p_target;
          if (value_type === "Expression Values"){
            let stats_comps = parseComponents(
              reaction,
              stats_dict);
            if(stats_comps[0].length > 0){
              p_source = Math.min(...stats_comps[0]);
            } else {
              p_source = 1.01; // It should be "null", but for sorting purpose, I cheat a little bit by setting the value to be 1.01.
            }
            if(stats_comps[1].length > 0){
              p_target = Math.min(...stats_comps[1]);
            } else {
              p_target = 1.01;
            }

          } else { // value_type === "Stats"
            p_source = Math.min(...updated_source);
            p_target = Math.min(...updated_target);
          }
          reaction.p_values = {"source":p_source, "target":p_target};
          reaction.magnitude_change = Math.abs(source_max - target_min);
          sample_motifs.push(reaction);

      }
    }
    for (let m in sample_motifs) {
      sample_motifs[m]['pathways'] = path_mapper[sample_motifs[m]['id']]
    }
    discovered_motifs.push(sample_motifs);
  }
  console.log(discovered_motifs);
  return discovered_motifs;
}

//Sustained
//let threshold = d3.select("#sustained_num").node().value;
// Will not include sustained motif if the value on both sides exactly the same
function motifSearch_Sustained(
    threshold,
    collapsed_reaction_dict,
    expression_dict,
    path_mapper,
<<<<<<< HEAD
    value_type,
    stats_dict,
    modifiers) {
=======
    degree_dict,
    sample_indices) {
>>>>>>> c628e7360f872ad7aeff3e1615b66e29957ec454
  console.log("motif search 4")
  console.log("Sustained perturbation threshold set at: ", threshold)
  let discovered_motifs = [];

      
      for (_idx in sample_indices) {
    let sample_motifs = [];

    for(let rxn in collapsed_reaction_dict){
      let reaction = collapsed_reaction_dict[rxn];
      let comps = parseComponents(
        reaction,
        expression_dict,
        degree_dict,
        _idx)
      let updated_source = comps[0];
      let updated_target = comps[1];
      
       if(updated_source.length>0 && updated_target.length>0) {


      // Sustained up-regulation
      let up_in = false;
      let up_out = false;
      let magnitude_change_up;
      for (i in updated_source) {
        if (updated_source[i] >= threshold) {
          up_in = true;

        }
        for (j in updated_target) {
          if (updated_target[j] >= threshold) {
            up_out = true;
          }
        }

      }
      if(up_in===true && up_out===true) {
        magnitude_change_up = Math.abs(Math.max(...updated_source) - Math.max(...updated_target));
      }

      // Sustained down-regulation
      let down_in = false;
      let down_out = false;
      let magnitude_change_down;
      for (k in updated_source) {
        if (updated_source[k] <= -(threshold)) {
          down_in = true;

        }
        for (l in updated_target) {
          if (updated_target[l] <= -(threshold)) {
            down_out.push(updated_target[l]);
          }
        }
      }
      if(down_in===true && down_out===true) {
        magnitude_change_down = Math.abs(Math.min(...updated_source) - Math.min(...updated_target));
      }

      if (((down_in === true) && (down_out === true)) || ((up_in === true) && (up_out === true))) {
        let magnitude_change;
        if(magnitude_change_up && magnitude_change_down){
          magnitude_change = Math.max(magnitude_change_up, magnitude_change_down);
        } else if (magnitude_change_up!=undefined){
          magnitude_change = magnitude_change_up;
        } else if(magnitude_change_down!=undefined){
          magnitude_change = magnitude_change_down;
        }
        reaction.magnitude_change = magnitude_change;
<<<<<<< HEAD

        let p_source;
        let p_target;
        if (value_type === "Expression Values"){
          let stats_comps = parseComponents(
            reaction,
            stats_dict);
          if(stats_comps[0].length > 0){
            p_source = Math.min(...stats_comps[0]);
          } else {
            p_source = 1.01; // It should be "null", but for sorting purpose, I cheat a little bit by setting the value to be 1.01.
          }
          if(stats_comps[1].length > 0){
            p_target = Math.min(...stats_comps[1]);
          } else {
            p_target = 1.01;
          }

        } else { // value_type === "Stats"
          p_source = Math.min(...updated_source);
          p_target = Math.min(...updated_target);
        }
        reaction.p_values = {"source":p_source, "target":p_target};

        discovered_motifs.push(reaction);
=======
        sample_motifs.push(reaction);
>>>>>>> c628e7360f872ad7aeff3e1615b66e29957ec454
      }
    }

    for (let m in sample_motifs) {
      sample_motifs[m]['pathways'] = path_mapper[sample_motifs[m]['id']]
    }
    discovered_motifs.push(sample_motifs);
  }
  console.log(discovered_motifs);
  return discovered_motifs;
}

//Path max/min comparison
//let threshold = d3.select("#pathmax_num").node().value;
function motifSearch_PathMax(
    threshold,
    mod_collapsed_pathways,
    collapsed_reaction_dict,
    expression_dict,
    path_mapper,
<<<<<<< HEAD
    value_type,
    stats_dict,
    modifiers) {
  console.log("motif search 5")
=======
    degree_dict,
    sample_indices) {
  console.log("motif search 99")
>>>>>>> c628e7360f872ad7aeff3e1615b66e29957ec454
  console.log("Pathway min/max threshold set at: ", threshold)
  let discovered_motifs = [];

  for (_idx in sample_indices) {
    let sample_motifs = [];

    // For each pathway, get reactions
    for (pathway in mod_collapsed_pathways) {

      let values = [];
      let reactions = mod_collapsed_pathways[pathway].reactions;
      for (rxn in reactions) {
        let reaction = collapsed_reaction_dict[reactions[rxn]];
        let comps = parseComponents(
          reaction,
          expression_dict,
          degree_dict,
          _idx)
        let updated_source = comps[0];
        let updated_target = comps[1];

        // Combine all values
        values = values.concat(updated_source, updated_target);
      }
      if (values.length > 0) {
        if (Math.abs(Math.max.apply(Math,values) - Math.min.apply(Math,values)) >= threshold) {
          sample_motifs.push(mod_collapsed_pathways[pathway]);
        }
      }
    }
    discovered_motifs.push(sample_motifs);
  }
  return discovered_motifs;
  // Get expression for all entities of components
  // Compare min/max
  // Return to list if true
  // Will need to reformat motif display since just showing pathways, not reactions (make dummy reactions?)
  // Make sorting index for later that is also output

<<<<<<< HEAD
    let values = [];
    let stats_values = [];

    let reactions = mod_collapsed_pathways[pathway].reactions;
    for (rxn in reactions) {
      let reaction = collapsed_reaction_dict[reactions[rxn]];
      let comps = parseComponents(
        reaction,
        expression_dict)
      let updated_source = comps[0];
      let updated_target = comps[1];
      if(value_type === "Expression Values"){
        let stats_comps =  parseComponents(
          reaction,
          stats_dict);
        stats_values = stats_values.concat(stats_comps[0], stats_comps[1])
      }
=======
}

//Path coverage comparison
//let threshold = d3.select("#pathcov_num").node().value;
function motifSearch_PathCov(
    threshold,
    min_coverage,
    mod_collapsed_pathways,
    collapsed_reaction_dict,
    stats_dict,
    path_mapper,
    degree_dict,
    sample_indices) {
  console.log("motif search 100")
  console.log("threshold set at: ", threshold)
  let discovered_motifs = [];
>>>>>>> c628e7360f872ad7aeff3e1615b66e29957ec454

  for (_idx in sample_indices) {
    let sample_motifs = [];

    // For each pathway, get reactions
    for (pathway in mod_collapsed_pathways) {

      let values = 0;
      let total = 0;

      let reactions = mod_collapsed_pathways[pathway].reactions;
      for (rxn in reactions) {
        let reaction = collapsed_reaction_dict[reactions[rxn]];
        let comps = parseComponents(
          reaction,
          stats_dict,
          degree_dict,
          _idx)
        let updated_source = comps[0].filter(stat => stat < threshold);
        let updated_target = comps[1].filter(stat => stat < threshold);

        // Check that at least one component in the reaction meets thresholding
        // criteria
        if (updated_source.length + updated_target.length > 0) {
          values = values + 1;
        }
        total = total + 1;
      }

    if (values.length > 0) {
      if (Math.abs(Math.max.apply(Math,values) - Math.min.apply(Math,values)) >= threshold) {
        mod_collapsed_pathways[pathway].magnitude_change = Math.abs(Math.max.apply(Math,values) - Math.min.apply(Math,values));
        if(value_type === "Expression Values"){
          mod_collapsed_pathways[pathway].p_value = Math.min(...stats_values);
        } else{ // value_type === "Stats"
          mod_collapsed_pathways[pathway].p_value = Math.min(...values);
        }
        discovered_motifs.push(mod_collapsed_pathways[pathway]);
/*
      let cov = values / total;
      if (cov >= min_coverage) {
        sample_motifs.push([
          mod_collapsed_pathways[pathway],
          cov,
          values,
          total
        ]);
*/
      }
    }

    sample_motifs.sort(function(one, two) {
      return two[1] - one[1];
    });

    discovered_motifs[_idx] = sample_motifs;
  }
  console.log(discovered_motifs);
  return discovered_motifs;
}


function modifierReg(
    threshold,
    collapsed_reaction_dict,
    expression_dict,
    path_mapper,
    degree_dict,
    sample_indices) {
  // If the net change between at least one modifier and one core component of a
  // reaction is greater than or equal to the threshold, return the reaction
  // *** Checking the "include modifiers" button will have no effect here
  console.log("motif search 5")
  console.log("ModReg threshold set at: ", threshold)
  let discovered_motifs = [];

  for (_idx in sample_indices) {
    let sample_motifs = [];

    for(let rxn in collapsed_reaction_dict) {
      let reaction = collapsed_reaction_dict[rxn];
      let comps = parseComponentsMod(
        reaction,
        expression_dict,
        degree_dict,
        _idx)
      let updated_core = comps[0];
      let updated_modifiers = comps[1];

      if(updated_core.length>0 && updated_modifiers.length>0){

        // Check each core/mod combination for a diff that meets threshold
        for(x in updated_core) {
          for (y in updated_modifiers) {
            if (Math.abs(updated_core[x] - updated_modifiers[y]) >= threshold) {
              if(!sample_motifs.includes(reaction)) {
                sample_motifs.push(reaction);
              }
            }
          }
        }

      }
    }
    for (let m in sample_motifs) {
      sample_motifs[m]['pathways'] = path_mapper[sample_motifs[m]['id']]
    }
    discovered_motifs.push(sample_motifs);
  }
  console.log(discovered_motifs);
  return discovered_motifs;
}

function modifierTransport(
    threshold,
    collapsed_reaction_dict,
    expression_dict,
    path_mapper,
    degree_dict,
    sample_indices) {
  // Highlight if modifier changed where inputs and outputs are same (minus
  //    compartment) --> regulation of transport reaction
  // If a componenet on both sides meets threshold and a modifier seperately
  // meets threshold, return
  console.log("motif search 6")
  console.log("ModReg threshold set at: ", threshold)
  let discovered_motifs = [];

  for (_idx in sample_indices) {
    let sample_motifs = [];

    for(let rxn in collapsed_reaction_dict){
      let reaction = collapsed_reaction_dict[rxn];
      let comps = parseComponentsTrans(
        reaction,
        expression_dict,
        degree_dict,
        _idx)
      let updated_source = comps[0];
      let updated_target = comps[1];
      let updated_modifier = comps[2];

      if(updated_source.length>0 && updated_target.length>0 && updated_modifier.length>0) {
        let intersect = updated_source.filter(x => updated_target.includes(x));
        for (x in intersect) {
          for (y in updated_modifier) {
            if ((Math.abs(intersect[x] - updated_modifier[y]) >= threshold) |
                (Math.abs(intersect[x]) >= threshold & Math.abs(updated_modifier[y]) >= threshold)) {
              if(!sample_motifs.includes(reaction)) {
                sample_motifs.push(reaction);
              }
            }
          }
        }
      }
    }

    for (let m in sample_motifs) {
      sample_motifs[m]['pathways'] = path_mapper[sample_motifs[m]['id']]
    }
    discovered_motifs.push(sample_motifs);
  }
  console.log(discovered_motifs);
  return discovered_motifs;
}
