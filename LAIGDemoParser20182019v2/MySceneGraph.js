var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var ANIMATIONS_INDEX = 7;
var PRIMITIVES_INDEX = 8;
var COMPONENTS_INDEX = 9;

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

        this.defaultCamera;
        this.cameras = [];

        this.ambient = [];
        this.background = [];

        this.lights = [];
        this.spots = [];

        this.textures = [];
        this.materials = [];
        this.transformations = [];
        this.animations = [];

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

        // <animations>
        if ((index = nodeNames.indexOf("animations")) == -1)
            return "tag <animations> missing";
        else {
            if (index != ANIMATIONS_INDEX)
                this.onXMLMinorError("tag <animations> out of order");

            //Parse scene block
            if ((error = this.parseAnimations(nodes[index])) != null)
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

        if (!(this.axis_length != null && !isNaN(this.axis_length) && this.axis_length >= 0))
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

        if (fromIndex == -1)
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

        var from = vec3.fromValues(x, y, z);

        if (toIndex == -1)
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

        var to = vec3.fromValues(x, y, z);

        var camera = new CGFcamera(angle * DEGREE_TO_RAD, near, far, from, to);

        if (perspectiveId == this.defaultCamera) {
            this.scene.camera = camera;
            this.scene.interface.setActiveCamera(camera);
        }

        this.cameras[perspectiveId] = camera;

        return null;
    }

    parseOrtho(orthoNode) {
        // Get id of the current perspective.
        var orthoId = this.reader.getString(orthoNode, 'id');
        if (orthoId == null)
            return "no ID defined for ortho";

        // Checks for repeated IDs.
        if (this.cameras[orthoId] != null)
            return "ID must be unique for each view (conflict: ID = " + orthoId + ")";

        // near
        var near = this.reader.getFloat(orthoNode, 'near');
        if (!(near != null && !isNaN(near)))
            return "unable to parse near of view for ID = " + orthoId;

        // far
        var far = this.reader.getFloat(orthoNode, 'far');
        if (!(far != null && !isNaN(far)))
            return "unable to parse far of view for ID = " + orthoId;

        // left
        var left = this.reader.getFloat(orthoNode, 'left');
        if (!(left != null && !isNaN(left)))
            return "unable to parse left of view for ID = " + orthoId;

        // right
        var right = this.reader.getFloat(orthoNode, 'right');
        if (!(right != null && !isNaN(right)))
            return "unable to parse right of view for ID = " + orthoId;

        // top
        var top = this.reader.getFloat(orthoNode, 'top');
        if (!(top != null && !isNaN(top)))
            return "unable to parse top of view for ID = " + orthoId;

        // bottom
        var bottom = this.reader.getFloat(orthoNode, 'bottom');
        if (!(bottom != null && !isNaN(bottom)))
            return "unable to parse bottom of view for ID = " + orthoId;

        var children = orthoNode.children;

        var nodeNames = [];
        for (var i = 0; i < children.length; i++) {
            nodeNames.push(children[i].nodeName);
        }

        var fromIndex = nodeNames.indexOf("from");
        var toIndex = nodeNames.indexOf("to");

        if (fromIndex == -1)
            return "no from defined for ortho" + orthoId;

        // x
        var x = this.reader.getFloat(children[fromIndex], 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x of from of view for ID = " + orthoId;

        // y
        var y = this.reader.getFloat(children[fromIndex], 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y of from of view for ID = " + orthoId;

        // z
        var z = this.reader.getFloat(children[fromIndex], 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z of from of view for ID = " + orthoId;

        var from = vec3.fromValues(x, y, z);

        if (toIndex == -1)
            return "no to defined for ortho" + orthoId;

        // x
        x = this.reader.getFloat(children[toIndex], 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x of to of view for ID = " + orthoId;

        // y
        y = this.reader.getFloat(children[toIndex], 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y of to of view for ID = " + orthoId;

        // z
        z = this.reader.getFloat(children[toIndex], 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z of to of view for ID = " + orthoId;

        var to = vec3.fromValues(x, y, z);

        var up = vec3.fromValues(0, 1, 0);

        var camera = new CGFcameraOrtho(left, right, bottom, top, near, far, from, to, up);

        if (orthoId == this.defaultCamera) {
            this.scene.camera = camera;
            this.scene.interface.setActiveCamera(camera);
        }

        this.cameras[orthoId] = camera;

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
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse red component of ambient light";
        else
            this.ambient.push(r);

        // g
        var g = this.reader.getFloat(children[ambientIndex], 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse green component of ambient light";
        else
            this.ambient.push(g);

        // b
        var b = this.reader.getFloat(children[ambientIndex], 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
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
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse red component of background color";
        else
            this.background.push(r);

        // g
        var g = this.reader.getFloat(children[backgroundIndex], 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse green component of background color";
        else
            this.background.push(g);

        // b
        var b = this.reader.getFloat(children[backgroundIndex], 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
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
     * Parses the <lights> block.
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        if (children.length == 0)
            return "at least one light must be defined";
        else if (children.length > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        var error;

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {
            switch (children[i].nodeName) {
                case "omni": if ((error = this.parseOmni(children[i])) != null)
                    return error;
                    break;
                case "spot": if ((error = this.parseSpot(children[i])) != null)
                    return error;
                    break;
                default: this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                    break;
            }
        }

        this.log("Parsed lights");

        return null;
    }

    parseOmni(omniNode) {
        // Get id of the current light.
        var lightId = this.reader.getString(omniNode, 'id');
        if (lightId == null)
            return "no ID defined for light";

        // Checks for repeated IDs.
        if (this.lights[lightId] != null)
            return "ID must be unique for each light (conflict: ID = " + lightId + ")";

        // Light enable/disable
        var enable = this.reader.getInteger(omniNode, 'enabled');
        if (!(enable != null && !isNaN(enable) && (enable == 0 || enable == 1)))
            this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");
        else
            enable = enable == 0 ? false : true;

        this.lights[lightId] = [];
        this.lights[lightId].push(enable);

        var children = omniNode.children;
        // Specifications for the current light.

        var nodeNames = [];
        for (var j = 0; j < children.length; j++) {
            nodeNames.push(children[j].nodeName);
        }

        var error;

        // Gets indices of each element.
        var locationIndex = nodeNames.indexOf("location");
        var ambientIndex = nodeNames.indexOf("ambient");
        var diffuseIndex = nodeNames.indexOf("diffuse");
        var specularIndex = nodeNames.indexOf("specular");

        if (locationIndex == -1)
            return "location not found for light id=" + lightId;

        if ((error = this.parseLocation(children[locationIndex], lightId)) != null)
            return error + " of light " + lightId;

        if (ambientIndex == -1)
            return "ambient not found for light id=" + lightId;

        if ((error = this.parseLightRGBA(children[ambientIndex], lightId)) != null)
            return error + " of ambient of light " + lightId;

        if (diffuseIndex == -1)
            return "diffuse not found for light id=" + lightId;

        if ((error = this.parseLightRGBA(children[diffuseIndex], lightId)) != null)
            return error + " of diffuse of light " + lightId;

        if (specularIndex == -1)
            return "specular not found for light id=" + lightId;

        if ((error = this.parseLightRGBA(children[specularIndex], lightId)) != null)
            return error + " of specular of light " + lightId;

        return null;
    }

    parseSpot(spotNode) {
        // Get id of the current light.
        var lightId = this.reader.getString(spotNode, 'id');
        if (lightId == null)
            return "no ID defined for light";

        // Checks for repeated IDs.
        if (this.lights[lightId] != null)
            return "ID must be unique for each light (conflict: ID = " + lightId + ")";

        // Light enable/disable
        var enable = this.reader.getInteger(spotNode, 'enabled');
        if (!(enable != null && !isNaN(enable) && (enable == 0 || enable == 1)))
            this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");
        else
            enable = enable == 0 ? false : true;

        this.lights[lightId] = [];
        this.lights[lightId].push(enable);

        this.spots[lightId] = [];

        // angle
        var angle = this.reader.getFloat(spotNode, 'angle');
        if (!(angle != null && !isNaN(angle)))
            return "unable to parse angle of light" + lightId;

        this.spots[lightId].push(angle);

        // exponent
        var exponent = this.reader.getFloat(spotNode, 'exponent');
        if (!(exponent != null && !isNaN(exponent)))
            return "unable to parse exponent of light" + lightId;

        this.spots[lightId].push(exponent);

        var children = spotNode.children;
        // Specifications for the current light.

        var nodeNames = [];
        for (var j = 0; j < children.length; j++) {
            nodeNames.push(children[j].nodeName);
        }

        var error;

        // Gets indices of each element.
        var locationIndex = nodeNames.indexOf("location");
        var targetIndex = nodeNames.indexOf("target");
        var ambientIndex = nodeNames.indexOf("ambient");
        var diffuseIndex = nodeNames.indexOf("diffuse");
        var specularIndex = nodeNames.indexOf("specular");

        if (locationIndex == -1)
            return "location not found for light id=" + lightId;

        if ((error = this.parseLocation(children[locationIndex], lightId)) != null)
            return error + " of light " + lightId;

        if (targetIndex == -1)
            return "target not found for light id=" + lightId;

        if ((error = this.parseTarget(children[targetIndex], lightId)) != null)
            return error + " of light " + lightId;

        if (ambientIndex == -1)
            return "ambient not found for light id=" + lightId;

        if ((error = this.parseLightRGBA(children[ambientIndex], lightId)) != null)
            return error + " of ambient of light " + lightId;

        if (diffuseIndex == -1)
            return "diffuse not found for light id=" + lightId;

        if ((error = this.parseLightRGBA(children[diffuseIndex], lightId)) != null)
            return error + " of diffuse of light " + lightId;

        if (specularIndex == -1)
            return "specular not found for light id=" + lightId;

        if ((error = this.parseLightRGBA(children[specularIndex], lightId)) != null)
            return error + " of specular of light " + lightId;

        return null;
    }

    parseLocation(locationNode, lightId) {
        // x
        var x = this.reader.getFloat(locationNode, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x of location";
        // y
        var y = this.reader.getFloat(locationNode, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y of location";
        // z
        var z = this.reader.getFloat(locationNode, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z of location";
        // w
        var w = this.reader.getFloat(locationNode, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w of location";

        var array = [];
        array.push(x, y, z, w);
        this.lights[lightId].push(array);

        return null;
    }

    parseLightRGBA(rgbaNode, lightId) {
        // r
        var r = this.reader.getFloat(rgbaNode, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse r of " + type;
        // g
        var g = this.reader.getFloat(rgbaNode, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse g of " + type;
        // b
        var b = this.reader.getFloat(rgbaNode, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse b of " + type;
        // a
        var a = this.reader.getFloat(rgbaNode, 'a');
        if (!(a != null && !isNaN(a)))
            return "unable to parse a of " + type;

        var array = [];
        array.push(r, g, b, a);
        this.lights[lightId].push(array);

        return null;
    }

    parseTarget(targetNode, lightId) {
        // x
        var x = this.reader.getFloat(targetNode, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x of target";
        // y
        var y = this.reader.getFloat(targetNode, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y of target";
        // z
        var z = this.reader.getFloat(targetNode, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z of target";

        var array = [];
        array.push(x, y, z);
        this.spots[lightId].push(array);

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
     * Parses the <materials> block.
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        if (children.length == 0)
            return "at least one material must be defined";

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var materialId = this.reader.getString(children[i], 'id');
            if (materialId == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialId] != null)
                return "ID must be unique for each material (conflict: ID = " + materialId + ")";

            var material = new CGFappearance(this.scene);

            // shininess
            var shininess = this.reader.getFloat(children[i], 'shininess');
            if (!(shininess != null && !isNaN(shininess)))
                return "unable to parse shininess of translate";

            material.setShininess(shininess);

            this.materials[materialId] = material;

            var grandChildren = children[i].children;

            var nodeNames = [];

            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var emissionIndex = nodeNames.indexOf("emission");
            var ambientIndex = nodeNames.indexOf("ambient");
            var diffuseIndex = nodeNames.indexOf("diffuse");
            var specularIndex = nodeNames.indexOf("specular");

            // Emission
            if (emissionIndex == -1)
                return "no emission for material id=" + materialId;

            // Ambient
            if (ambientIndex == -1)
                return "no ambient for material id=" + materialId;

            // Diffuse
            if (diffuseIndex == -1)
                return "no diffuse for material id=" + materialId;

            // Specular
            if (specularIndex == -1)
                return "no specular for material id=" + materialId;

            var error;

            if ((error = this.parseMaterialRGBA(grandChildren[emissionIndex], materialId, "emission")) != null)
                return error + "of material " + materialId;

            if ((error = this.parseMaterialRGBA(grandChildren[ambientIndex], materialId, "ambient")) != null)
                return error + "of material " + materialId;

            if ((error = this.parseMaterialRGBA(grandChildren[diffuseIndex], materialId, "diffuse")) != null)
                return error + "of material " + materialId;

            if ((error = this.parseMaterialRGBA(grandChildren[specularIndex], materialId, "specular")) != null)
                return error + "of material " + materialId;
        }

        this.log("Parsed materials");

        return null;
    }

    parseMaterialRGBA(rgbanode, materialId, type) {
        // r
        var r = this.reader.getFloat(rgbanode, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse r of " + type;
        // g
        var g = this.reader.getFloat(rgbanode, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse g of " + type;
        // b
        var b = this.reader.getFloat(rgbanode, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse b of " + type;
        // a
        var a = this.reader.getFloat(rgbanode, 'a');
        if (!(a != null && !isNaN(a)))
            return "unable to parse a of " + type;

        switch (type) {
            case "emission":
                this.materials[materialId].setEmission(r, g, b, a);
                return null;
            case "ambient":
                this.materials[materialId].setAmbient(r, g, b, a);
                return null;
            case "diffuse":
                this.materials[materialId].setDiffuse(r, g, b, a);
                return null;
            case "specular":
                this.materials[materialId].setSpecular(r, g, b, a);
                return null;
        }
    }

    /**
     * Parses the <transformations> block.
     */
    parseTransformations(transformationsNode) {
        var children = transformationsNode.children;

        if (children.length == 0)
            return "at least one transformation must be defined";

        var grandChildren = [];

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
     * Parses the <animations> block.
     */
    parseAnimations(animationsNode) {
        var children = animationsNode.children;
        var error;

        // Any number of transformations.
        for (var i = 0; i < children.length; i++) {
            switch (children[i].nodeName) {
                case "linear": if ((error = this.parseLinearAnimation(children[i])) != null)
                    return error;
                    break;
                case "circular": if ((error = this.parseCircularAnimation(children[i])) != null)
                    return error;
                    break;
                default: this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                    continue;
            }
        }

        this.log("Parsed animations");

        return null;
    }

    parseLinearAnimation(linearanimationNode) {
        var animationId = this.reader.getString(linearanimationNode, 'id');
        if (animationId == null)
            return "no ID defined for animation";

        // Checks for repeated IDs.
        if (this.animations[animationId] != null)
            return "ID must be unique for each animations (conflict: ID = " + animationId + ")";

        // span
        var span = this.reader.getFloat(linearanimationNode, 'span');
        if (!(span != null && !isNaN(span)))
            return "unable to parse span of the animation for ID = " + animationId;

        var children = linearanimationNode.children;

        var controlPoints = [];

        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != "controlpoint") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // xx
            var xx = this.reader.getFloat(children[i], 'xx');
            if (!(xx != null && !isNaN(xx)))
                return "unable to parse xx-coordinate of control point for ID = " + animationId;

            // y
            var yy = this.reader.getFloat(children[i], 'yy');
            if (!(yy != null && !isNaN(yy)))
                return "unable to parse yy-coordinate of control point for ID = " + animationId;

            // zz
            var zz = this.reader.getFloat(children[i], 'zz');
            if (!(zz != null && !isNaN(zz)))
                return "unable to parse zz-coordinate of control point for ID = " + animationId;

            controlPoints.push([xx, yy, zz]);
        }

        if (controlPoints.length < 2)
            return "at least two control point must be defined for animation" + animationId;

        this.animations[animationId] = new MyLinearAnimation(this.scene, span, controlPoints);

        return null;
    }

    parseCircularAnimation(circularanimationNode) {
        var animationId = this.reader.getString(circularanimationNode, 'id');
        if (animationId == null)
            return "no ID defined for animation";

        // Checks for repeated IDs.
        if (this.animations[animationId] != null)
            return "ID must be unique for each animations (conflict: ID = " + animationId + ")";

        // span
        var span = this.reader.getFloat(circularanimationNode, 'span');
        if (!(span != null && !isNaN(span)))
            return "unable to parse span of the animation for ID = " + animationId;

        // center
        var center = this.reader.getVector3(circularanimationNode, 'center');
        if (center == null)
            return "unable to parse center of the animation for ID = " + animationId;

        // radius
        var radius = this.reader.getFloat(circularanimationNode, 'radius');
        if (!(radius != null && !isNaN(radius)))
            return "unable to parse radius of the animation for ID = " + animationId;

        // startang
        var startang = this.reader.getFloat(circularanimationNode, 'startang');
        if (!(startang != null && !isNaN(startang)))
            return "unable to parse startang of the animation for ID = " + animationId;

        // rotang
        var rotang = this.reader.getFloat(circularanimationNode, 'rotang');
        if (!(rotang != null && !isNaN(rotang)))
            return "unable to parse rotang of the animation for ID = " + animationId;

        this.animations[animationId] = new MyCircularAnimation(this.scene, span, center, radius, startang, rotang);

        return null;
    }

    /**
     * Parses the <primitives> block.
     */
    parsePrimitives(primitivesNode) {

        var children = primitivesNode.children;

        if (children.length == 0)
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
                case "cylinder": if ((error = this.parseCylinder(grandChildren[0], primitiveId)) != null)
                    return error;
                    break;
                case "sphere": if ((error = this.parseSphere(grandChildren[0], primitiveId)) != null)
                    return error;
                    break;
                case "torus": if ((error = this.parseTorus(grandChildren[0], primitiveId)) != null)
                    return error;
                    break;
                case "plane": if ((error = this.parsePlane(grandChildren[0], primitiveId)) != null)
                    return error;
                    break;
                case "patch": if ((error = this.parsePatch(grandChildren[0], primitiveId)) != null)
                    return error;
                    break;
                case "vehicle": this.primitives[primitiveId] = new MyVehicle(this.scene);
                    break;
                case "cylinder2": if ((error = this.parseCylinder2(grandChildren[0], primitiveId)) != null)
                    return error;
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

    parseCylinder(cylinderNode, primitiveId) {
        // base
        var base = this.reader.getFloat(cylinderNode, 'base');
        if (!(base != null && !isNaN(base) && base >= 0))
            return "unable to parse base of the primitive for ID = " + primitiveId;

        // top
        var top = this.reader.getFloat(cylinderNode, 'top');
        if (!(top != null && !isNaN(top) && top >= 0))
            return "unable to parse top of the primitive for ID = " + primitiveId;

        // height
        var height = this.reader.getFloat(cylinderNode, 'height');
        if (!(height != null && !isNaN(height) && height >= 0))
            return "unable to parse height of the primitive for ID = " + primitiveId;

        // slices
        var slices = this.reader.getInteger(cylinderNode, 'slices');
        if (!(slices != null && !isNaN(slices) && slices > 0))
            return "unable to parse slices of the primitive for ID = " + primitiveId;

        // stacks
        var stacks = this.reader.getInteger(cylinderNode, 'stacks');
        if (!(stacks != null && !isNaN(stacks) && stacks > 0))
            return "unable to parse stacks of the primitive for ID = " + primitiveId;

        this.primitives[primitiveId] = new MyCylinder(this.scene, base, top, height, slices, stacks);

        return null;
    }

    parseSphere(sphereNode, primitiveId) {
        // radius
        var radius = this.reader.getFloat(sphereNode, 'radius');
        if (!(radius != null && !isNaN(radius) && radius >= 0))
            return "unable to parse radius of the primitive for ID = " + primitiveId;

        // slices
        var slices = this.reader.getInteger(sphereNode, 'slices');
        if (!(slices != null && !isNaN(slices) && slices > 0))
            return "unable to parse slices of the primitive for ID = " + primitiveId;

        // stacks
        var stacks = this.reader.getInteger(sphereNode, 'stacks');
        if (!(stacks != null && !isNaN(stacks) && stacks > 0))
            return "unable to parse stacks of the primitive for ID = " + primitiveId;

        this.primitives[primitiveId] = new MySphere(this.scene, radius, slices, stacks);

        return null;
    }

    parseTorus(torusNode, primitiveId) {
        // inner
        var inner = this.reader.getFloat(torusNode, 'inner');
        if (!(inner != null && !isNaN(inner) && inner >= 0))
            return "unable to parse inner of the primitive for ID = " + primitiveId;

        // outer
        var outer = this.reader.getFloat(torusNode, 'outer');
        if (!(outer != null && !isNaN(outer) && outer >= 0))
            return "unable to parse outer of the primitive for ID = " + primitiveId;

        // slices
        var slices = this.reader.getInteger(torusNode, 'slices');
        if (!(slices != null && !isNaN(slices) && slices > 0))
            return "unable to parse slices of the primitive for ID = " + primitiveId;

        // loops
        var loops = this.reader.getInteger(torusNode, 'loops');
        if (!(loops != null && !isNaN(loops) && loops > 0))
            return "unable to parse loops of the primitive for ID = " + primitiveId;

        this.primitives[primitiveId] = new MyTorus(this.scene, inner, outer, slices, loops);

        return null;
    }

    parsePlane(planeNode, primitiveId) {
        // npartsU
        var npartsU = this.reader.getInteger(planeNode, 'npartsU');
        if (!(npartsU != null && !isNaN(npartsU) && npartsU > 0))
            return "unable to parse npartsU of the primitive for ID = " + primitiveId;

        // npartsV
        var npartsV = this.reader.getInteger(planeNode, 'npartsV');
        if (!(npartsV != null && !isNaN(npartsV) && npartsV > 0))
            return "unable to parse npartsV of the primitive for ID = " + primitiveId;

        this.primitives[primitiveId] = new MyPlane(this.scene, npartsU, npartsV);

        return null;
    }

    parsePatch(patchNode, primitiveId) {
        // npointsU
        var npointsU = this.reader.getInteger(patchNode, 'npointsU');
        if (!(npointsU != null && !isNaN(npointsU) && npointsU > 0))
            return "unable to parse npointsU of the primitive for ID = " + primitiveId;

        // npointsV
        var npointsV = this.reader.getInteger(patchNode, 'npointsV');
        if (!(npointsV != null && !isNaN(npointsV) && npointsV > 0))
            return "unable to parse npointsV of the primitive for ID = " + primitiveId;

        // npartsU
        var npartsU = this.reader.getInteger(patchNode, 'npartsU');
        if (!(npartsU != null && !isNaN(npartsU) && npartsU > 0))
            return "unable to parse npartsU of the primitive for ID = " + primitiveId;

        // npartsV
        var npartsV = this.reader.getInteger(patchNode, 'npartsV');
        if (!(npartsV != null && !isNaN(npartsV) && npartsV > 0))
            return "unable to parse npartsV of the primitive for ID = " + primitiveId;

        var children = patchNode.children;

        if (children.length != npointsU * npointsV)
            return "number of patch " + primitiveId + " control points should be " + (npointsU * npointsV) + " (npointsU * npointsV) but is " + children.length;


        var controlpoints = [];
        var points = [];

        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != "controlpoint") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // xx
            var xx = this.reader.getFloat(children[i], 'xx');
            if (!(xx != null && !isNaN(xx)))
                return "unable to parse xx-coordinate of control point of patch for ID = " + primitiveId;

            // yy
            var yy = this.reader.getFloat(children[i], 'yy');
            if (!(yy != null && !isNaN(yy)))
                return "unable to parse yy-coordinate of control point of patch for ID = " + primitiveId;

            // zz
            var zz = this.reader.getFloat(children[i], 'zz');
            if (!(zz != null && !isNaN(zz)))
                return "unable to parse zz-coordinate of control point of patch for ID = " + primitiveId;

            points.push([xx, yy, zz, 1]);

            if ((i + 1) % npointsV == 0) {
                controlpoints.push(points);
                points = [];
            }
        }

        this.primitives[primitiveId] = new MyPatch(this.scene, npointsU, npointsV, npartsU, npartsV, controlpoints);

        return null;
    }

    parseCylinder2(cylinder2Node, primitiveId) {
        // base
        var base = this.reader.getFloat(cylinder2Node, 'base');
        if (!(base != null && !isNaN(base) && base >= 0))
            return "unable to parse base of the primitive for ID = " + primitiveId;

        // top
        var top = this.reader.getFloat(cylinder2Node, 'top');
        if (!(top != null && !isNaN(top) && top >= 0))
            return "unable to parse top of the primitive for ID = " + primitiveId;

        // height
        var height = this.reader.getFloat(cylinder2Node, 'height');
        if (!(height != null && !isNaN(height) && height >= 0))
            return "unable to parse height of the primitive for ID = " + primitiveId;

        // slices
        var slices = this.reader.getInteger(cylinder2Node, 'slices');
        if (!(slices != null && !isNaN(slices) && slices > 0))
            return "unable to parse slices of the primitive for ID = " + primitiveId;

        // stacks
        var stacks = this.reader.getInteger(cylinder2Node, 'stacks');
        if (!(stacks != null && !isNaN(stacks) && stacks > 0))
            return "unable to parse stacks of the primitive for ID = " + primitiveId;

        this.primitives[primitiveId] = new MyCylinder2(this.scene, base, top, height, slices, stacks);

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
            var materialsIndex = nodeNames.indexOf("materials");
            var textureIndex = nodeNames.indexOf("texture");
            var childrenIndex = nodeNames.indexOf("children");
            var animationsIndex = nodeNames.indexOf("animations");

            // Transformation
            if (transformationIndex == -1)
                return "no transformation for component id=" + componentId;

            var greatChildren = grandChildren[transformationIndex].children;

            if (greatChildren.length == 0)
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

            //Animations
            var animations = [];

            if (animationsIndex != -1) {
                var greatChildren = grandChildren[animationsIndex].children;

                for (var j = 0; j < greatChildren.length; j++) {
                    var animationId = this.reader.getString(greatChildren[j], 'id');

                    animations.push(this.animations[animationId]);
                }
            }

            //Materials
            if (materialsIndex == -1)
                return "no materials block for component id=" + componentId;

            greatChildren = grandChildren[materialsIndex].children;

            if (greatChildren.length == 0)
                return "no materials for component id=" + componentId;

            var materialId;
            var materials = [];

            for (var j = 0; j < greatChildren.length; j++) {
                materialId = this.reader.getString(greatChildren[j], 'id');

                if (materialId == null)
                    return "no ID defined for material of component ID=" + componentId;

                if (materialId == "inherit")
                    materials[j] = materialId;

                else {
                    if (this.materials[materialId] == null)
                        return "no material " + materialId + " defined (found in component " + materialId + ")";

                    materials[j] = this.materials[materialId];
                }
            }

            //Textures
            if (textureIndex == -1)
                return "no texture block for component id=" + componentId;

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
            var length_s = this.reader.getFloat(grandChildren[textureIndex], 'length_s', false);
            if (!(length_s != null && !isNaN(length_s) && length_s >= 0) && !(textureId == "inherit" || textureId == "none"))
                return "unable to parse length_s of texture of compoment for ID = " + componentId;

            // length_t
            var length_t = this.reader.getFloat(grandChildren[textureIndex], 'length_t', false);
            if (!(length_t != null && !isNaN(length_t) && length_t >= 0) && !(textureId == "inherit" || textureId == "none"))
                return "unable to parse length_t of texture of compoment for ID = " + componentId;

            //Children
            if (childrenIndex == -1)
                return "no children block for component id=" + componentId;

            greatChildren = grandChildren[childrenIndex].children;

            if (greatChildren.length == 0)
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
                    return "no primitive with id = " + primitiveRef[j];

                children_primitives.push(this.primitives[primitiveRef[j]]);
            }

            var component = new MyComponent(this.scene, transformation, animations, materials, texture, length_s, length_t, componentRef, children_primitives);

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
        this.root.display(this.scene.defaultMaterial, this.scene.defaultTexture, 1.0, 1.0);
    }
}