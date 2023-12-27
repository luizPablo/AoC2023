const fs = require('fs');

const seedSoilMap = [];
const soilFertilizerMap = [];
const fertilizerWaterMap = [];
const waterLightMap = [];
const lightTemperatureMap = [];
const temperatureHumidityMap = [];
const humidityLocationMap = [];


const process = () => {
    const fileContent = fs.readFileSync(__dirname + '/input.txt', 'utf-8');
    const content = fileContent.split('\n\n');

    const seeds = content[0].split(':')[1].trim().match(/\d+/g).map(Number);

    const seedSoil = content[1].split(':')[1].trim();
    const soilFertilizer = content[2].split(':')[1].trim();
    const fertilizerWater = content[3].split(':')[1].trim();
    const waterLight = content[4].split(':')[1].trim();
    const lightTemperature = content[5].split(':')[1].trim();
    const temparatureHumidity = content[6].split(':')[1].trim();
    const humidityLocation = content[7].split(':')[1].trim();

    buildMaps(seedSoil, soilFertilizer, fertilizerWater, waterLight, lightTemperature, temparatureHumidity, humidityLocation);

    // part 1
    let locations = [];
    seeds.forEach((seed) => {
        locations.push(seedRangeMapper([[seed, seed]]));
    });

    console.log('Min location (part 1): ', Math.min(...locations));

    // part 2
    let seedRanges = [];

    for (let i = 0; i < seeds.length; i += 2) {
        seedRanges.push([seeds[i], seeds[i] + seeds[i + 1] - 1]);
    }

    let seedRangesLocations = [];

    seedRanges.forEach((seedRange) => {
        seedRangesLocations.push(seedRangeMapper([seedRange]));
    });

    console.log('Min location (part 2): ', Math.min(...seedRangesLocations));


};

const buildMaps = (seedSoil, soilFertilizer, fertilizerWater, waterLight, lightTemperature, temperatureHumidity, humidityLocation) => {
    buildMap(seedSoil, seedSoilMap);
    buildMap(soilFertilizer, soilFertilizerMap);
    buildMap(fertilizerWater, fertilizerWaterMap);
    buildMap(waterLight, waterLightMap);
    buildMap(lightTemperature, lightTemperatureMap);
    buildMap(temperatureHumidity, temperatureHumidityMap);
    buildMap(humidityLocation, humidityLocationMap);
};

const buildMap = (input, map) => {
    input.split('\n').forEach((line) => {
        const numbersMap = line.match(/\d+/g).map(Number);
        map.push(numbersMap); 0
    });

    map.sort((a, b) => a[1] - b[1]);
};


const seedRangeMapper = (ranges) => {
    const maps = [seedSoilMap, soilFertilizerMap, fertilizerWaterMap, waterLightMap, lightTemperatureMap, temperatureHumidityMap, humidityLocationMap];
    let result = ranges;
    let pendingRanges = ranges;

    maps.forEach((map) => {
        let partialResult = [];

        while (pendingRanges.length > 0) {
            const range = pendingRanges.shift();

            const { resultRange, pendingRanges: newPendingRanges } = mapper(range, map);

            partialResult.push(resultRange);

            if (newPendingRanges.length) {
                pendingRanges.push(...newPendingRanges);
            }
        };

        result = partialResult.sort((a, b) => a[0] - b[0]);
        pendingRanges = result;
    });

    return result[0][0];
};

const mapper = (range, map) => {
    let mapFound = false;
    let pendingRanges = [];

    for (let i = 0; i < map.length; i++) {
        const [target, source, steps] = map[i];

        // |---------------|
        // -----|-----|-----
        if (range[0] >= source && range[1] <= source + steps - 1) {
            mapFound = true;

            return {
                resultRange: [
                    target + (range[0] - source),
                    target + (range[1] - source),
                ],
                pendingRanges: [],
            };
        }

        // ---|------------|
        // |-------|--------
        if (range[0] < source && range[1] <= source + steps - 1 && range[1] >= source) {
            let outerRange = [
                range[0],
                source - 1,
            ];

            let innerRange = [
                target,
                target + (range[1] - source),
            ];

            pendingRanges.push(outerRange);

            mapFound = true;

            return {
                resultRange: innerRange,
                pendingRanges,
            };
        }

        // |-------|--------
        // ---|------------|
        if (range[0] >= source && range[0] < source + steps && range[1] > source + steps - 1) {
            let sourceEnd = source + steps;

            let outerRange = [
                sourceEnd,
                range[1],
            ];

            let innerRange = [
                target + (range[0] - source),
                target + steps - 1,
            ];

            pendingRanges.push(outerRange);

            mapFound = true;

            return {
                resultRange: innerRange,
                pendingRanges,
            };
        }

        // -----|-----|-----
        // |---------------|
        if (range[0] < source && range[1] >= source + steps) {
            let sourceEnd = source + steps;
            let innerRange = [target, target + steps - 1];

            let leftOuterRange = [range[0], source - 1];
            let rightOuterRange = [sourceEnd, range[1]];

            pendingRanges.push(leftOuterRange);
            pendingRanges.push(rightOuterRange);

            mapFound = true;

            return {
                resultRange: innerRange,
                pendingRanges,
            };
        }
    };

    if (!mapFound) {
        pendingRanges = [];
    }

    return {
        resultRange: range,
        pendingRanges,
    };
};

process();