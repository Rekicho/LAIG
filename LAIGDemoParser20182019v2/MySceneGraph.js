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
var COMPONENTS_INDEX = 8;

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

        this.idRoot = null;                    // The id of the root element.
        this.axisLength = 5;

        this.ambient = [];
        this.background = [];

        this.primitives = [];

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

        /*
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

        */

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

        /*

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

        */

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

        /*

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

        */
    }

    /**
     * Parses the <scene> block.
     */
    parseScene(scenesNode) {
        this.idRoot = this.reader.getString(scenesNode, 'root');

        if (this.idRoot == null)
            return "no root ID";

        this.axisLength = this.reader.getString(scenesNode, 'axis_length');
        
        if (this.axisLength == null)
            return "no axis length";
    }

    /**
     * Parses the <ambient> block.
     */
    parseAmbient(ambientNode) {
        var children = ambientNode.children;

        var nodeNames = [];
        for (var i = 0; i < children.length; i++) {
            nodeNames.push(children[i].nodeName);
        }

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        //Ambient Light

        if(ambientIndex == -1)
            return "no ambient light";

        // r
        var r = this.reader.getFloat(children[ambientIndex], 'r');
        if (!(r != null && !isNaN(r)))
            return "unable to parse red component of ambient light";
        else
            this.ambient.push(r);

        // g
        var g = this.reader.getFloat(children[ambientIndex], 'g');
        if (!(g != null && !isNaN(g)))
            return "unable to parse green component of ambient light";
        else
            this.ambient.push(g);

        // b
        var b = this.reader.getFloat(children[ambientIndex], 'b');
        if (!(b != null && !isNaN(b)))
            return "unable to parse blue component of ambient light";
        else
            this.ambient.push(b);

        // a
        var a = this.reader.getFloat(children[ambientIndex], 'a');
        if (!(a != null && !isNaN(a)))
            return "unable to parse alpha component of ambient light";
        else
            this.ambient.push(a);

        //Background color

        if(backgroundIndex == -1)
            return "no background color";

        // r
        var r = this.reader.getFloat(children[backgroundIndex], 'r');
        if (!(r != null && !isNaN(r)))
            return "unable to parse red component of background color";
        else
            this.background.push(r);

        // g
        var g = this.reader.getFloat(children[backgroundIndex], 'g');
        if (!(g != null && !isNaN(g)))
            return "unable to parse green component of background color";
        else
            this.background.push(g);

        // b
        var b = this.reader.getFloat(children[backgroundIndex], 'b');
        if (!(b != null && !isNaN(b)))
            return "unable to parse blue component of background color";
        else
            this.background.push(b);

        // a
        var a = this.reader.getFloat(children[backgroundIndex], 'a');
        if (!(a != null && !isNaN(a)))
            return "unable to parse alpha component of background color";
        else
            this.background.push(a);
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

            var translate = grandChildren[0];

            var translateCoord = [];

            // x
            var x = this.reader.getFloat(translate, 'x');
            if (!(x != null && !isNaN(x)))
                return "unable to parse x-translation of the transformation for ID = " + transformationId;
            else
                translateCoord.push(x);

            // y
            var y = this.reader.getFloat(translate, 'y');
            if (!(y != null && !isNaN(y)))
                return "unable to parse y-translation of the transformation for ID = " + transformationId;
            else
                translateCoord.push(y);

            // z
            var z = this.reader.getFloat(translate, 'z');
            if (!(z != null && !isNaN(z)))
                return "unable to parse z-translation of the transformation for ID = " + transformationId;
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

        var error;

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

            switch(nodeName) {
                case "rectangle": if ((error = this.parseRectangle(grandChildren[0], primitiveId)) != null)
                                    return error;
                                  break;
                case "triangle":  if ((error = this.parseTriangle(grandChildren[0], primitiveId)) != null)
                                  return error;
                                  break;

                case "cylinder":  /*if ((error = this.parseCylinder(grandChildren[0], primitiveId)) != null)
                                  return error;*/
                                  break;

                case "sphere":    /*if ((error = this.parseSphere(grandChildren[0], primitiveId)) != null)
                                  return error;*/
                                  break;

                case "torus":     /*if ((error = this.parseTorus(grandChildren[0]), primitiveId) != null)
                                  return error;*/
                                  break;

                default: return "Unknown primitive " + nodeName + "with ID = " + primitiveId;
            }
            
            numPrimitives++;
        }

        if (numPrimitives == 0)
            return "at least one primitive must be defined";

        this.log("Parsed primitives");

        return null;
    }

    parseRectangle(rectangleNode, primitiveId){
        // x1
        var x1 = this.reader.getFloat(rectangleNode, 'x1');
        if (!(x1 != null && !isNaN(x1)))
            return "unable to parse x1-coordinate of the primitive for ID = " + primitiveId;

        // y1
        var y1 = this.reader.getFloat(rectangleNode, 'y1');
        if (!(y1 != null && !isNaN(y1)))
            return "unable to parse y1-coordinate of the primitive for ID = " + primitiveId;

        // x2
        var x2 = this.reader.getFloat(rectangleNode, 'x2');
        if (!(x2 != null && !isNaN(x2)))
            return "unable to parse x2-coordinate of the primitive for ID = " + primitiveId;

        // y2
        var y2 = this.reader.getFloat(rectangleNode, 'y2');
        if (!(y2 != null && !isNaN(y2)))
            return "unable to parse y2-coordinate of the primitive for ID = " + primitiveId;

        this.primitives[primitiveId] = new MyRectangle(this.scene, x1, y1, x2, y2);
    }

    parseTriangle(triangleNode, primitiveId){
        // x1
        var x1 = this.reader.getFloat(triangleNode, 'x1');
        if (!(x1 != null && !isNaN(x1)))
            return "unable to parse x1-coordinate of the primitive for ID = " + primitiveId;

        // y1
        var y1 = this.reader.getFloat(triangleNode, 'y1');
        if (!(y1 != null && !isNaN(y1)))
            return "unable to parse y1-coordinate of the primitive for ID = " + primitiveId;

        // z1
        var z1 = this.reader.getFloat(triangleNode, 'z1');
        if (!(z1 != null && !isNaN(z1)))
            return "unable to parse z1-coordinate of the primitive for ID = " + primitiveId;

        // x2
        var x2 = this.reader.getFloat(triangleNode, 'x2');
        if (!(x2 != null && !isNaN(x2)))
            return "unable to parse x2-coordinate of the primitive for ID = " + primitiveId;

        // y2
        var y2 = this.reader.getFloat(triangleNode, 'y2');
        if (!(y2 != null && !isNaN(y2)))
            return "unable to parse y2-coordinate of the primitive for ID = " + primitiveId;

        // z2
        var z2 = this.reader.getFloat(triangleNode, 'z2');
        if (!(z2 != null && !isNaN(z2)))
            return "unable to parse z2-coordinate of the primitive for ID = " + primitiveId;

        // x3
        var x3 = this.reader.getFloat(triangleNode, 'x3');
        if (!(x3 != null && !isNaN(x3)))
            return "unable to parse x3-coordinate of the primitive for ID = " + primitiveId;

        // y3
        var y3 = this.reader.getFloat(triangleNode, 'y3');
        if (!(y3 != null && !isNaN(y3)))
            return "unable to parse y3-coordinate of the primitive for ID = " + primitiveId;

        // z3
        var z3 = this.reader.getFloat(triangleNode, 'z3');
        if (!(z3 != null && !isNaN(z3)))
            return "unable to parse z3-coordinate of the primitive for ID = " + primitiveId;

        this.primitives[primitiveId] = new MyTriangle(this.scene, x1, y1, z1, x2, y2, z2, x3, y3, z3);
    }

    /**
     * Parses the <components> block.
     */
    parseComponents(componentsNode) {

        var children = componentsNode.children;

        this.components = [];
        var numComponents = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of components.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "component") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current components.
            var componentId = this.reader.getString(children[i], 'id');
            if (componentId == null)
                return "no ID defined for component";

            // Checks for repeated IDs.
            if (this.components[componentId] != null)
                return "ID must be unique for each component (conflict: ID = " + componentId + ")";

            grandChildren = children[i].children;
            // Specifications for the current component.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            // Gets indices of each element.
            var transformationIndex = nodeNames.indexOf("transformation");
            var materialsIndex = nodeNames.indexOf("materials");
            var textureIndex = nodeNames.indexOf("texture");
            var childrenIndex = nodeNames.indexOf("children");

            //SO PARA TESTE

            var transformationChildren =  grandChildren[transformationIndex].children;

            var transformationRefId = this.reader.getString(transformationChildren[0], 'id');

            this.componentTransformation = [];

            this.components.push(componentId);
            this.componentTransformation.push(transformationRefId);

            //TODO:FINISH

            // TODO: Store Light global information.
            //this.lights[lightId] = ...;
            numComponents++;
        }

        if (numComponents == 0)
            return "at least one component must be defined";

        this.log("Parsed component");

        return null;

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
        for(var key in this.primitives){
            this.primitives[key].display();
        }
        // entry point for graph rendering
        //TODO: Render loop starting at root of graph
    }
}