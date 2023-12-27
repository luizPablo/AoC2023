const fs = require('fs');

const process = () => {
    const content = fs.readFileSync('min-input.txt', 'utf8');
    const lines = content.split('\n');

    const componentsMap = new Map();

    // mapping components to components
    for (let line of lines) {
        let [left, right] = line.trim().split(': ');
        right = right.split(' ');

        for (let component of right) {
            if (!componentsMap.has(left)) {
                componentsMap.set(left, new Set());
            }

            componentsMap.get(left).add(component);

            if (!componentsMap.has(component)) {
                componentsMap.set(component, new Set());
            }

            componentsMap.get(component).add(left);
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

process();
