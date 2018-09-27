var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var PRIMITIVES_INDEX = 7;
var COMPONENTSS_INDEX = 8;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null;                    // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */

        this.reader.open('scenes/' + filename, this);
    }


    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "yas")
            return "root tag <yas> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;
        var index;

        // Processes each node, verifying errors.

        /*
        // <scene>
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order");

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse scene block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <ambient>
        if ((index = nodeNames.indexOf("ambient")) == -1)
            return "tag <ambient> missing";
        else {
            if (index != AMBIENT_INDEX)
                this.onXMLMinorError("tag <ambient> out of order");

            //Parse scene block
            if ((error = this.parseAmbient(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse scene block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }

        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse scene block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse scene block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        */

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse scene block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse scene block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <components> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse scene block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
    }

    /**
     * Parses the <transformations> block.
     */
    parseTransformations(transformationsNode) {
        var children = transformationsNode.children;

        this.transformations = [];
        var numTransformations = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of transformations.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "transformation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current transformation.
            var transformationId = this.reader.getString(children[i], 'id');
            if (transformationId == null)
                return "no ID defined for transformation";

            // Checks for repeated IDs.
            if (this.transformations[transformationId] != null)
                return "ID must be unique for each transformation (conflict: ID = " + transformationId + ")";

            grandChildren = children[i].children;

            // Specifications for the current primitive.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            // Gets indices of each element.
            /*var translateIndex = nodeNames.indexOf("translate");
            //var rotateIndex = nodeNames.indexOf("rotate");
            //var scaleIndex = nodeNames.indexOf("scale");*/

            //GET ALL TRANSLATE, ROTATE, SCALE

            //FOR TESTING, nodeNames[0] is translate

            var translateIndex = nodeNames[0];

            var translateCoord = [];

            // x
            var x = this.reader.getFloat(grandChildren[translateIndex], 'x');
            if (!(x != null && !isNaN(x)))
                return "unable to parse x-translation of the transformation for ID = " + translateIndex;
            else
                translateCoord.push(x);

            // y
            var y = this.reader.getFloat(grandChildren[translateIndex], 'y');
            if (!(y != null && !isNaN(y)))
                return "unable to parse y-translation of the transformation for ID = " + translateIndex;
            else
                translateCoord.push(y);

            // z
            var z = this.reader.getFloat(grandChildren[translateIndex], 'z');
            if (!(z != null && !isNaN(z)))
                return "unable to parse z-translation of the transformation for ID = " + translateIndex;
            else
                translateCoord.push(z);

            // TODO: Store Light global information.
            //this.lights[lightId] = ...;

            //TEMPORARY
            this.transCoord = translateCoord;
            //TEMPORARY

            numTransformations++;
        }

        if (numTransformations == 0)
            return "at least one transformation must be defined";

        this.log("Parsed transformations");

        return null;
    }

    /**
     * Parses the <primitives> block.
     */
    parsePrimitives(primitivesNode) {

        var children = primitivesNode.children;

        this.primitives = [];
        var numPrimitives = 0;

        var grandChildren = [];
        var nodeName;

        // Any number of primitives.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "primitive") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current light.
            var primitiveId = this.reader.getString(children[i], 'id');
            if (primitiveId == null)
                return "no ID defined for primitive";

            // Checks for repeated IDs.
            if (this.primitives[primitiveId] != null)
                return "ID must be unique for each primitive (conflict: ID = " + primitiveId + ")";

            grandChildren = children[i].children;

            if (grandChildren.length > 1)
                return "more than one tag in primitive with ID = " + primitiveId;

            // Specifications for the current primitive.

            nodeName = grandChildren[0].nodeName;

            //TO DO: ADD OTHER PRIMITIVES
            if (nodeName != "rectangle")
                return "Unknown primitive " + nodeName + "with ID = " + primitiveId;

            // Retrieves the primitive position.
            var positionPrimitive = [];

            // x1
            var x1 = this.reader.getFloat(grandChildren[0], 'x1');
            if (!(x1 != null && !isNaN(x1)))
                return "unable to parse x1-coordinate of the primitive for ID = " + primitiveId;
            else
                positionPrimitive.push(x1);

            // y1
            var y1 = this.reader.getFloat(grandChildren[0], 'y1');
            if (!(y1 != null && !isNaN(y1)))
                return "unable to parse y1-coordinate of the primitive for ID = " + primitiveId;
            else
                positionPrimitive.push(y1);

            // x2
            var x2 = this.reader.getFloat(grandChildren[0], 'x2');
            if (!(x2 != null && !isNaN(x2)))
                return "unable to parse x2-coordinate of the primitive for ID = " + primitiveId;
            else
                positionPrimitive.push(x2);

            // y2
            var y2 = this.reader.getFloat(grandChildren[0], 'y2');
            if (!(y2 != null && !isNaN(y2)))
                return "unable to parse y2-coordinate of the primitive for ID = " + lightId;
            else
                positionPrimitive.push(y2);

            //TODO: CHECK 2 > 1

            // TODO: Store Primitive global information.
            //this.primitives[primitiveId] = ...;

            //TEMPORARY
            this.rectanglecoordinates = positionPrimitive;
            //TEMPORARY
            
            numPrimitives++;
        }

        if (numPrimitives == 0)
            return "at least one primitive must be defined";

        this.log("Parsed primitives");

        return null;
    }

    /**
     * Parses the <components> block.
     */
    parseComponents(componentsNode) {

    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }


    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        // entry point for graph rendering
        //TODO: Render loop starting at root of graph
    }
}