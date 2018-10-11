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
        this.root = null;
        this.axis_length;

        this.cameras = [];
        this.defaultCamera;

        this.ambient = [];
        this.background = [];

        this.textures = [];
        this.transformations = [];

        this.primitives = [];
        this.components = [];

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

        */

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

        /*

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
     * Parses the <scene> block.
     */
    parseScene(scenesNode) {
        this.idRoot = this.reader.getString(scenesNode, 'root');

        if (this.idRoot == null)
            return "no root ID";

        this.axis_length = this.reader.getInteger(scenesNode, 'axis_length');

        if (!(this.axis_length != null && !isNaN(this.axis_length)))
            return "no axis length";

        this.log("Parsed scene");

        return null;
    }

    /**
     * Parses the <views> block.
     */
    parseViews(viewsNode) {
        this.defaultCamera = this.reader.getString(viewsNode, 'default');

        if (this.defaultCamera == null)
            return "no default view";

        var children = viewsNode.children;

        if (children.length < 1)
            return "no views";

        var error;

        for (var i = 0; i < children.length; i++) {
            switch (children[i].nodeName) {
                case "perspective":
                    if ((error = this.parsePerspective(children[i])) != null)
                        return error;
                    break;
                case "ortho":
                    if ((error = this.parseOrtho(children[i])) != null)
                        return error;
                    break;
                default: return "unkown tag " + children[i].nodeName + " in views";
            }
        }

        this.log("Parsed views");

        return null;
    }

    parsePerspective(perspectiveNode) {
        // Get id of the current perspective.
        var perspectiveId = this.reader.getString(perspectiveNode, 'id');
        if (perspectiveId == null)
            return "no ID defined for perspective";

        // Checks for repeated IDs.
        if (this.cameras[perspectiveId] != null)
            return "ID must be unique for each view (conflict: ID = " + perspectiveId + ")";

        // near
        var near = this.reader.getFloat(perspectiveNode, 'near');
        if (!(near != null && !isNaN(near)))
            return "unable to parse near of view for ID = " + perspectiveId;

        // far
        var far = this.reader.getFloat(perspectiveNode, 'far');
        if (!(far != null && !isNaN(far)))
            return "unable to parse far of view for ID = " + perspectiveId;

        // angle
        var angle = this.reader.getFloat(perspectiveNode, 'angle');
        if (!(angle != null && !isNaN(angle)))
            return "unable to parse angle of view for ID = " + perspectiveId;

        var children = perspectiveNode.children;

        var nodeNames = [];
        for (var i = 0; i < children.length; i++) {
            nodeNames.push(children[i].nodeName);
        }

        var fromIndex = nodeNames.indexOf("from");
        var toIndex = nodeNames.indexOf("to");

        if(fromIndex == -1)
            return "no from defined for prespective" + perspectiveId;

        // x
        var x = this.reader.getFloat(children[fromIndex], 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x of from of view for ID = " + perspectiveId;

        // y
        var y = this.reader.getFloat(children[fromIndex], 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y of from of view for ID = " + perspectiveId;

        // z
        var z = this.reader.getFloat(children[fromIndex], 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z of from of view for ID = " + perspectiveId;

        var from = vec3.fromValues(x,y,z);

        if(toIndex == -1)
            return "no to defined for prespective" + perspectiveId;

        // x
        x = this.reader.getFloat(children[toIndex], 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x of to of view for ID = " + perspectiveId;

        // y
        y = this.reader.getFloat(children[toIndex], 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y of to of view for ID = " + perspectiveId;

        // z
        z = this.reader.getFloat(children[toIndex], 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z of to of view for ID = " + perspectiveId;

        var to = vec3.fromValues(x,y,z);

        var camera = new CGFcamera(angle*DEGREE_TO_RAD,near,far,from,to);

        if(perspectiveId == this.defaultCamera)
            this.scene.camera = camera;

        this.cameras[perspectiveId] = camera;

        return null;
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

        if (ambientIndex == -1)
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

        if (backgroundIndex == -1)
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

        this.log("Parsed ambient");

        return null;
    }

    /**
     * Parses the <textures> block.
     */
    parseTextures(texturesNode) {
        var children = texturesNode.children;

        if (children.length == 0)
            return "at least one transformation must be defined";

        // Any number of textures.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "texture") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current texture.
            var textureId = this.reader.getString(children[i], 'id');
            if (textureId == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.textures[textureId] != null)
                return "ID must be unique for each texture (conflict: ID = " + textureId + ")";

            var textureFile = this.reader.getString(children[i], 'file');

            if (textureFile == null)
                return "no File defined for texture with ID = " + textureId;

            var texture = new CGFtexture(this.scene, textureFile);

            this.textures[textureId] = texture;
        }

        this.log("Parsed textures");

        return null;
    }

    /**
     * Parses the <transformations> block.
     */
    parseTransformations(transformationsNode) {
        var children = transformationsNode.children;

        if (children.length == 0)
            return "at least one transformation must be defined";

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

            this.scene.loadIdentity();

            var error = this.parseTransformationBlock(grandChildren);

            if (error != null)
                return error + "in transformation id=" + transformationId;

            this.transformations[transformationId] = this.scene.getMatrix();

            this.scene.loadIdentity();
        }

        this.log("Parsed transformations");

        return null;
    }

    parseTransformationBlock(transformarionblockNode) {

        var error;

        for (var i = 0; i < transformarionblockNode.length; i++) {

            switch (transformarionblockNode[i].nodeName) {

                case "translate":
                    if ((error = this.parseTranslate(transformarionblockNode[i])) != null)
                        return error + " in transformation block ";
                    break;

                case "rotate":
                    if ((error = this.parseRotate(transformarionblockNode[i])) != null)
                        return error + " in transformation block ";
                    break;

                case "scale":
                    if ((error = this.parseScale(transformarionblockNode[i])) != null)
                        return error + " in transformation block ";
                    break;

                default: return "unknown transformation " + transformarionblockNode[i].nodeName;
            }
        }

        return null;
    }

    parseTranslate(translateNode) {
        // x
        var x = this.reader.getFloat(translateNode, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x of translate";
        // y
        var y = this.reader.getFloat(translateNode, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y of translate";
        // z
        var z = this.reader.getFloat(translateNode, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z of translate";

        this.scene.translate(x, y, z);
        return null;
    }

    parseRotate(rotateNode) {
        // axis
        var axis = this.reader.getString(rotateNode, 'axis');
        if (axis == null)
            return "unable to parse axis of rotate";

        // angle
        var angle = this.reader.getFloat(rotateNode, 'angle');
        if (!(angle != null && !isNaN(angle)))
            return "unable to parse angle of rotate";

        angle *= DEGREE_TO_RAD;

        switch (axis) {
            case "x":
                this.scene.rotate(angle, 1, 0, 0);
                break;
            case "y":
                this.scene.rotate(angle, 0, 1, 0);
                break;
            case "z":
                this.scene.rotate(angle, 0, 0, 1);
                break;
            default: return "unkown axis" + axis;
        }

        return null;
    }

    parseScale(scaleNode) {
        // x
        var x = this.reader.getFloat(scaleNode, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x of scale";
        // y
        var y = this.reader.getFloat(scaleNode, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y of scale";
        // z
        var z = this.reader.getFloat(scaleNode, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z of scale";

        this.scene.scale(x, y, z);
        return null;
    }

    /**
     * Parses the <primitives> block.
     */
    parsePrimitives(primitivesNode) {

        var children = primitivesNode.children;

        if (primitivesNode.children == 0)
            return "at least one primitive must be defined";

        this.primitives = [];

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

            switch (nodeName) {
                case "rectangle": if ((error = this.parseRectangle(grandChildren[0], primitiveId)) != null)
                    return error;
                    break;
                case "triangle": if ((error = this.parseTriangle(grandChildren[0], primitiveId)) != null)
                    return error;
                    break;

                case "cylinder":  /*if ((error = this.parseCylinder(grandChildren[0], primitiveId)) != null)
                                    return error;*/
                    break;

                case "sphere": if ((error = this.parseSphere(grandChildren[0], primitiveId)) != null)
                    return error;
                    break;

                case "torus":     /*if ((error = this.parseTorus(grandChildren[0]), primitiveId) != null)
                                    return error;*/
                    break;

                default: return "Unknown primitive " + nodeName + "with ID = " + primitiveId;
            }
        }

        this.log("Parsed primitives");

        return null;
    }

    parseRectangle(rectangleNode, primitiveId) {
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

        return null;
    }

    parseTriangle(triangleNode, primitiveId) {
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

        return null;
    }

    parseSphere(sphereNode, primitiveId) {
        // radius
        var radius = this.reader.getFloat(sphereNode, 'radius');
        if (!(radius != null && !isNaN(radius)))
            return "unable to parse radius of the primitive for ID = " + primitiveId;

        // slices
        var slices = this.reader.getInteger(sphereNode, 'slices');
        if (!(slices != null && !isNaN(slices)))
            return "unable to parse slices of the primitive for ID = " + primitiveId;

        // stacks
        var stacks = this.reader.getInteger(sphereNode, 'stacks');
        if (!(stacks != null && !isNaN(stacks)))
            return "unable to parse stacks of the primitive for ID = " + primitiveId;

        this.primitives[primitiveId] = new MySphere(this.scene, radius, slices, stacks);

        return null;
    }

    /**
     * Parses the <components> block.
     */
    parseComponents(componentsNode) {
        var children = componentsNode.children;

        if (children.length == 0)
            return "at least one component must be defined";

        var grandChildren = [];
        var nodeNames = [];

        var error;

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
            //var materialsIndex = nodeNames.indexOf("materials");
            var textureIndex = nodeNames.indexOf("texture");
            var childrenIndex = nodeNames.indexOf("children");

            // Transformation
            if (transformationIndex == -1)
                return "no transformation for component id=" + componentId;

            var greatChildren = grandChildren[transformationIndex].children;

            if (greatChildren.length < 0)
                return "no transformations for component id=" + componentId;

            nodeNames = [];
            for (var j = 0; j < greatChildren.length; j++) {
                nodeNames.push(greatChildren[j].nodeName);
            }

            var transformation;

            var transformationrefIndex = nodeNames.indexOf("transformationref");

            if (greatChildren.length != 1 && transformationrefIndex != -1)
                return "more than one transformarionref for compoent id=" + componentId;

            this.scene.loadIdentity();

            if (greatChildren.length == 1 && transformationrefIndex != -1) {
                var transformationrefID = this.reader.getString(greatChildren[transformationrefIndex], 'id');

                if (transformationrefID == null)
                    return "no ID defined for transformationref of component ID=" + componentId;

                transformation = this.transformations[transformationrefID];
            }

            else {
                error = this.parseTransformationBlock(greatChildren);

                if (error != null)
                    return error + "in compenent id=" + componentId;

                transformation = this.scene.getMatrix();
            }

            this.scene.loadIdentity();

            //Textures
            if (textureIndex == -1)
                return "no children block for component id=" + componentId;

            var textureId = this.reader.getString(grandChildren[textureIndex], 'id');

            if (textureId == null)
                return "no ID defined for texture of component ID=" + componentId;

            var texture;

            if (textureId == "inherit" || textureId == "none")
                texture = textureId;

            else texture = this.textures[textureId];

            if (texture == null)
                return "texture " + textureId + " not defined (from component ID=" + componentId + ")";

            // length_s
            var length_s = this.reader.getFloat(grandChildren[textureIndex], 'length_s');
            if (!(length_s != null && !isNaN(length_s)))
                return "unable to parse length_s of transformation of component ID = " + primitiveId;

            // length_t
            var length_t = this.reader.getFloat(grandChildren[textureIndex], 'length_t');
            if (!(length_t != null && !isNaN(length_t)))
                return "unable to parse length_t of transformation of component ID = " + primitiveId;


            //Children
            if (childrenIndex == -1)
                return "no children block for component id=" + componentId;

            greatChildren = grandChildren[childrenIndex].children;

            if (greatChildren.length < 0)
                return "no children for component id=" + componentId;

            var componentRef = [];
            var primitiveRef = [];

            for (var j = 0; j < greatChildren.length; j++) {
                switch (greatChildren[j].nodeName) {
                    case "componentref":
                        var componentRefId = this.reader.getString(greatChildren[j], 'id');
                        if (componentRefId == null)
                            return "no ID defined for componentRef of component ID=" + componentId;

                        // Checks for repeated IDs.
                        if (componentRef.indexOf(componentRefId) != -1)
                            return "ID must be unique for each componentRef (conflict: ID = " + componentRefId + ") for component" + componentId;

                        componentRef.push(componentRefId);
                        break;

                    case "primitiveref":
                        var primitiveRefId = this.reader.getString(greatChildren[j], 'id');
                        if (primitiveRefId == null)
                            return "no ID defined for primitiveRef of component ID=" + componentId;

                        // Checks for repeated IDs.
                        if (primitiveRef.indexOf(primitiveRefId) != -1)
                            return "ID must be unique for each primitiveRef (conflict: ID = " + primitiveRefId + ") for component" + componentId;

                        primitiveRef.push(primitiveRefId);
                        break;

                    default: this.onXMLMinorError("unknown tag <" + greatChildren[j].nodeName + "> in children for component id=" + componentId);
                        continue;
                }
            }
            var children_primitives = [];

            for (var j = 0; j < primitiveRef.length; j++) {
                if (!(primitiveRef[j] in this.primitives))
                    continue;//return "no primitive with id = " + primitiveRef[j];

                children_primitives.push(this.primitives[primitiveRef[j]]);
            }

            var component = new MyComponent(this.scene, transformation, texture, length_s, length_t, componentRef, children_primitives);

            this.components[componentId] = component;

            if (componentId == this.idRoot)
                this.root = component;
        }

        if ((error = this.root.buildChildren() != null))
            return error;

        this.log("Parsed components");

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
        this.root.display("none");
    }
}