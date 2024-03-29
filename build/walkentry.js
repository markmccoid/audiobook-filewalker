"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const audiobook_metadataAggr_1 = require("./audiobook-metadataAggr");
const { musicWalker } = require("./music-walkdir");
const { walkAndTagDirs, writeAggrMetaData } = require("./audiobook-walkdir");
const fs = require("fs");
const path = require("path");
console.log("proces", process.argv[2]);
const runType = process.argv[2];
//-- ---------------------------------------------------------
//-- Music Walker Entry
//-- walkentry {type} {starting directory} {output location} {output filename} {starting depth (optional)}
//--        starting depth should be 0 if artist dir in the starting dir (startingDir/artist1, startingDir/artist2, etc)
//--        starting depth should be -1 if there is a "genre" folder before artists (startingDir/genre1/artist1, startingDir/genre1/artist2, etc)
//-- ---------------------------------------------------------
if (runType === "music") {
    if (process.argv.length <= 4) {
        console.log("Usage: " +
            __filename +
            " {type} {starting directory} {output location} {output filename (default music-data.json)} {starting depth (optional)}");
        process.exit(-1);
    }
    const startingPath = process.argv[3];
    const outputPath = process.argv[4];
    let outputFile = process.argv[5];
    const startingDepth = process === null || process === void 0 ? void 0 : process.argv[6];
    // console.log(runType, startingPath, outputPath, parseInt(startingDepth));
    if (path.extname(outputFile) !== ".json") {
        outputFile = `${outputFile}.json`;
    }
    musicWalker(startingPath, parseInt(startingDepth)).then((res) => {
        fs.writeFileSync(path.join(outputPath, outputFile), JSON.stringify(res));
        console.log(`Output written to ${outputFile}`);
    });
}
//~~ ---------------------------------------------------------
//~~ Audiobook Walker Entry
//~~ walkentry {type} {aggr only} {aggr output location} {aggr output filename} {starting directory} {call google api}
//~~ ---------------------------------------------------------
if (runType === "audiobook") {
    console.log("Argv.length", process.argv.length, process.argv);
    if (process.argv.length < 5) {
        console.log(`Usage: \n __filename {type} {aggr only} {aggr output location} {aggr output filename} {starting directory} {call google api}
                    type = "audiobook" | "music"
                    aggr only = "yes" | "no"
                    ...
                    call google api = "yes" | "no" | "force"
                    depthToCategory -> this is number of dirs before we hit the primary category, if let blank, don't calc primary/secondary dirs
      `);
        process.exit(-1);
    }
    const isAggrOnly = process.argv[3] === "yes" ? true : false;
    const outputPath = process.argv[4];
    let outputFile = process.argv[5];
    const startingDir = process === null || process === void 0 ? void 0 : process.argv[6];
    const callGoogleApi = process === null || process === void 0 ? void 0 : process.argv[7];
    const depthToCategory = parseInt(process === null || process === void 0 ? void 0 : process.argv[8]) || undefined;
    if (!isAggrOnly) {
        walkAndTagDirs(startingDir, callGoogleApi).then((res) => {
            writeAggrMetaData(startingDir, outputPath, outputFile, true, depthToCategory);
            console.log(`Data written to ${path.join(outputPath, outputFile)}`);
        });
    }
    else {
        // The last param (true) is telling it to create a "clean" data file also
        writeAggrMetaData(startingDir, outputPath, outputFile, true, depthToCategory);
        console.log(`Data written to ${path.join(outputPath, outputFile)}`);
    }
}
if (runType === "metadata") {
    if (process.argv.length < 4) {
        console.log(`Usage: \n __filename {type} {aggr input-output location} {aggr input filename}`);
        process.exit(-1);
    }
    const inOutPath = process.argv[3];
    const inOutName = process.argv[4];
    const metaData = (0, audiobook_metadataAggr_1.aggregateMetadata)(inOutPath, inOutName);
    fs.writeFileSync(path.join(inOutPath, "bookMetadata.json"), JSON.stringify(metaData));
}
// C:/localStuff/musictest
// D:/Dropbox/Mark/myObsidian/Music/_templaterScripts
// // Store the starting directory
// const startingPath = process.argv[2];
// const outputFile = path.parse(process.argv[3] || "outputfile").name;
// const hydrateFlag = !!process.argv[4] ? false : true;
// // Read existing data file if it exists
// let currentIds = [];
// let currentData = {};
// if (fs.existsSync(`${outputFile}.json`)) {
//   currentData = JSON.parse(fs.readFileSync(`${outputFile}.json`, "utf8"));
//   Object.keys(currentData).forEach((key) => {
//     // For each key (folder) extract ids (author-title) and store in an array
//     currentIds = [
//       ...currentIds,
//       ...currentData[key].titles.map((title) => title.id),
//     ];
//   });
// }
// // pass currentIds and buildBook.. will only return NEW books to parse
// let bookData = buildBookDataObject(startingPath, currentIds);
// // bookData are the books that need to be hydrated
// // outputFile is the name of the file that will be written to
// // currentData is the currently loaded data file from previous load.
// // This allows us to not hit Google Books API for books that were added in the past
// if (hydrateFlag) {
//   hydrateBookData(bookData, outputFile, currentData);
// }
// musicWalker("D:/Dropbox/Mark/myMusic/", -1).then((res) => {
//   fs.writeFileSync(
//     "C:/localStuff/musictest/music-data.json",
//     JSON.stringify(res)
//   );
//   console.log(res);
// });
