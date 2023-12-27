const fs = require('fs');

function main(file) {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');

    const componentsMap = new Map();

    // mapping components to components
    for (let line of lines) {
        let [l, r] = line.trim().split(': ');
        r = r.split(' ');
        for (let comp of r) {
            if (!componentsMap.has(l)) {
                componentsMap.set(l, new Set());
            }

            componentsMap.get(l).add(comp);

            if (!componentsMap.has(comp)) {
                componentsMap.set(comp, new Set());
            }

            componentsMap.get(comp).add(l);
        }
    }

    // first component is always in the first group
    let firstGroup = 1;
    let secondGroup = 0;

    // get first element from map
    const initialComponent = componentsMap.keys().next().value;

    // iterate over all components, except the first one
    for (let component of componentsMap.keys()) {
        if (component === initialComponent) {
            continue;
        }

        let ways = 0;
        let usedComponents = new Set([initialComponent]);

        // iterate over all components connected to the first one
        for (let startingComponent of componentsMap.get(initialComponent)) {
            if (startingComponent === component) {
                ways++;

                continue;
            }

            // set of visited components
            let visited = new Set();

            // queue of components to visit
            let queue = [{ component: startingComponent, path: [startingComponent] }];

            // flag to stop walking the graph if reached the component
            let found = false;

            while (queue.length > 0 && !found && ways < 4) {
                let { component: currentComponent, path } = queue.shift();

                // iterate over all components connected to the current one
                for (let connectedComponent of componentsMap.get(currentComponent)) {
                    // we found the component, we find one way to get to it
                    if (connectedComponent === component) {
                        found = true;
                        ways++;

                        // add all components from the path to the used components
                        for (let pathComponent of path) {
                            usedComponents.add(pathComponent);
                        }

                        break;
                    }

                    // if all conditions are met, we can add the component to the queue
                    if (!visited.has(connectedComponent) && !path.includes(connectedComponent) && !usedComponents.has(connectedComponent)) {
                        visited.add(connectedComponent);
                        queue.push({ component: connectedComponent, path: [...path, connectedComponent] });
                    }
                }
            }
        }

        // If we find 4 or more ways to get to given component, we can add the component to the first group
        if (ways >= 4) {
            firstGroup++;
        } else {
            secondGroup++;
        }
    }

    console.log('day 25:', firstGroup * secondGroup);
}

if (require.main === module) {
    main('input.txt');
}