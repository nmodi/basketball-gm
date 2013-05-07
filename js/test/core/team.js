/**
 * @name test.core.team
 * @namespace Tests for core.team.
 */
define(["db", "globals", "core/league", "core/team"], function (db, g, league, team) {
    "use strict";

    describe("core/team", function () {
        describe("#filter()", function () {
            var t;

            before(function (done) {
                db.connectMeta(function () {
                    league.create("Test", 0, "random", function () {
                        g.dbl.transaction("teams", "readwrite").objectStore("teams").openCursor(4).onsuccess = function (event) {
                            var cursor, t;

                            cursor = event.target.result;
                            t = cursor.value;
                            t.stats[0].gp = 10;
                            t.stats[0].fg = 50;
                            t.stats[0].fga = 100;

                            cursor.update(t);

                            done();
                        };
                    });
                });
            });
            after(function (done) {
                league.remove(g.lid, done);
            });

            it("should return requested info if tid/season match", function (done) {
                team.filter({
                    attrs: ["tid", "abbrev"],
                    seasonAttrs: ["season", "won"],
                    stats: ["gp", "fg", "fgp"],
                    tid: 4,
                    season: g.season
                }, function (t) {
                    t.tid.should.equal(4);
                    t.abbrev.should.equal("CHI");
                    t.season.should.equal(g.season);
                    t.won.should.equal(0);
                    t.gp.should.equal(10);
                    t.fg.should.equal(5);
                    t.fgp.should.equal(50);
                    Object.keys(t).should.have.length(7);
                    t.hasOwnProperty("stats").should.equal(false);

                    done();
                });
            });
            it("should return an array if no team ID is specified", function (done) {
                team.filter({
                    attrs: ["tid", "abbrev"],
                    seasonAttrs: ["season", "won"],
                    stats: ["gp", "fg", "fgp"],
                    season: g.season
                }, function (teams) {
                    teams.should.have.length(g.numTeams);
                    teams[4].tid.should.equal(4);
                    teams[4].abbrev.should.equal("CHI");
                    teams[4].season.should.equal(g.season);
                    teams[4].won.should.equal(0);
                    teams[4].gp.should.equal(10);
                    teams[4].fg.should.equal(5);
                    teams[4].fgp.should.equal(50);
                    Object.keys(teams[4]).should.have.length(7);
                    teams[4].hasOwnProperty("stats").should.equal(false);

                    done();
                });
            });
            it("should return requested info if tid/season match, even when no attrs requested", function (done) {
                team.filter({
                    seasonAttrs: ["season", "won"],
                    stats: ["gp", "fg", "fgp"],
                    tid: 4,
                    season: g.season
                }, function (t) {
                    t.season.should.equal(g.season);
                    t.won.should.equal(0);
                    t.gp.should.equal(10);
                    t.fg.should.equal(5);
                    t.fgp.should.equal(50);
                    Object.keys(t).should.have.length(5);

                    done();
                });
            });
            it("should return requested info if tid/season match, even when no seasonAttrs requested", function (done) {
                team.filter({
                    attrs: ["tid", "abbrev"],
                    stats: ["gp", "fg", "fgp"],
                    tid: 4,
                    season: g.season
                }, function (t) {
                    t.tid.should.equal(4);
                    t.abbrev.should.equal("CHI");
                    t.gp.should.equal(10);
                    t.fg.should.equal(5);
                    t.fgp.should.equal(50);
                    Object.keys(t).should.have.length(5);

                    done();
                });
            });
            it("should return requested info if tid/season match, even when no stats requested", function (done) {
                team.filter({
                    attrs: ["tid", "abbrev"],
                    seasonAttrs: ["season", "won"],
                    tid: 4,
                    season: g.season
                }, function (t) {
                    t.tid.should.equal(4);
                    t.abbrev.should.equal("CHI");
                    t.season.should.equal(g.season);
                    t.won.should.equal(0);
                    Object.keys(t).should.have.length(4);

                    done();
                });
            });
/*            it("should return season totals is options.totals is true, and per-game averages otherwise", function () {
                var pf;

                pf = player.filter(p, {
                    stats: ["gp", "fg"],
                    tid: 4,
                    season: 2012,
                    totals: true
                });
                t.stats.gp.should.equal(5);
                t.stats.fg.should.equal(20);

                pf = player.filter(p, {
                    stats: ["gp", "fg"],
                    tid: 4,
                    season: 2012
                });
                t.stats.gp.should.equal(5);
                t.stats.fg.should.equal(4);
            });
            it("should return playoff stats if options.playoffs is true", function () {
                var pf;

                pf = player.filter(p, {
                    stats: ["gp", "fg"],
                    tid: 4,
                    season: 2012,
                    playoffs: true
                });
                t.stats.gp.should.equal(5);
                t.stats.fg.should.equal(4);
                t.statsPlayoffs.gp.should.equal(3);
                t.statsPlayoffs.fg.should.equal(10);
            });*/
        });
    });
});