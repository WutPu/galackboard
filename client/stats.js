import { Template } from 'meteor/templating';
import { Puzzles, Rounds } from '/lib/imports/collections.js';
import { HIDE_SOLVED } from './imports/settings.js';

Template.stats.helpers({
    numUnlockedPuzzles() {
        return Puzzles.find().count();
    },

    numSolvedPuzzles() {
        return Puzzles.find({solved: {$ne: null}}).count();
    },

    numMetas() {
        return Puzzles.find({puzzles: {$ne: null}}).count();
    },

    numSolvedMetas() {
        return Puzzles.find({solved: {$ne: null}, puzzles: {$ne: null}}).count();
    },

    prioList() {
        var r_puzzles = Puzzles.find({solved: null}).fetch();
        var r_rounds = Rounds.find().fetch();
        var metas = Puzzles.find().fetch().filter(a => "puzzles" in a);
        var meta_ids = metas.map(a => a._id);
        var unsolved_ids = r_puzzles.map(a => a._id);

        var solve_precent = {};
        var association = {};
        for (const round of r_rounds) {
            var total = 0;
            var solved = 0;

            var cor = [];

            for (const puzzle_id of round.puzzles) {
                if (!(meta_ids.includes(puzzle_id))) {
                    if (!(unsolved_ids.includes(puzzle_id))) {
                        solved += 1;
                    }
                    total += 1;
                }
                association[puzzle_id] = round._id;
            }
            if (total != 0) {
                solve_precent[round._id] = solved / total;
            }
        }

        for (const meta of metas) {
            var total = 0;
            var solved = 0;
            for (const puzzle_id of meta.puzzles) {
                if (!(unsolved_ids.includes(puzzle_id))) {
                    solved += 1;
                }
                total += 1;
                association[puzzle_id] = meta._id;
            }
            if (total != 0) {
                solve_precent[meta._id] = solved / total;
                association[meta._id] = meta._id;
            }
        }

        r_puzzles = r_puzzles.filter(a => !(Array.isArray(a.feedsInto)) || a.feedsInto.length == 0 || a.feedsInto.some(b => unsolved_ids.includes(b)));
        r_puzzles = r_puzzles.filter(a => !(meta_ids.includes(a._id)) || (solve_precent[a._id] >= 0.5));
        r_puzzles.sort(function(a, b) {
            if ("puzzles" in a && !("puzzles" in b)) {
                return -1;
            } else if (!("puzzles" in a) && "puzzles" in b) {
                return 1;
            } else {
                if (solve_precent[association[a._id]] < solve_precent[association[b._id]]) {
                    return -1;
                }
                if (solve_precent[association[a._id]] > solve_precent[association[b._id]]) {
                    return 1;
                }
            }
            
            if (a.created < b.created) return -1;
            if (a.created > b.created) return 1;
            return 0;
        });

        var out = "";
        var counter = 1;

        for (const element of r_puzzles) {
            if (counter >= 10) {
                break;
            }
            out += counter + ". ";

            if ("puzzles" in element) {
                out += "META: ";
            }
            out += element.name;

            out += "<br />";
            counter += 1;
        }

        return out
    }
});