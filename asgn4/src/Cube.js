class Cube{
    constructor(){
        this.type = "cube";
        //this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        //this.size = 5.0;
        //this.segments = 10;
        this.matrix = new Matrix4();
        this.textureNum = 0.0;

        this.tri = new Triangle();
    }

    render(){
        let tri = new Triangle();

        //var xy = this.position;
        var rgba = this.color;
        //var size = this.size;

        gl.uniform1f(u_SelectTexture, this.textureNum);

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        //gl.uniform1f(u_Size, size);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);
        
        tri.drawTriangle3DuvNormal([-1,-1,-1, 1,1,-1, 1,-1,-1] , [0,0, 1,1, 1,0], [0,0,-1, 0,0,-1, 0,0,-1]);
        tri.drawTriangle3DuvNormal([-1,-1,-1, -1,1,-1, 1,1,-1] , [0,0, 0,1, 1,1], [0,0,-1, 0,0,-1, 0,0,-1]);

        gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);

        tri.drawTriangle3DuvNormal([-1,1,-1, -1,1,1, 1,1,1], [0,0, 0,1, 1,1], [0,1,0, 0,1,0, 0,1,0]);
        tri.drawTriangle3DuvNormal([-1,1,-1, 1,1,1, 1,1,-1], [0,0, 1,1, 1,0], [0,1,0, 0,1,0, 0,1,0]);

        gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);

        tri.drawTriangle3DuvNormal([-1,-1,1, 1,-1,1, 1,1,1], [0,0, 1,0, 1,1], [0,0,1, 0,0,1, 0,0,1]);
        tri.drawTriangle3DuvNormal([-1,-1,1, 1,1,1, -1,1,1], [0,0, 1,1, 0,1], [0,0,1, 0,0,1, 0,0,1]);

        gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);

        tri.drawTriangle3DuvNormal([-1,-1,-1, 1,-1,1, -1,-1,1], [0,0, 1,1, 0,1], [0,-1,0, 0,-1,0, 0,-1,0]);
        tri.drawTriangle3DuvNormal([-1,-1,-1, 1,-1,-1, 1,-1,1], [0,0, 1,0, 1,1], [0,-1,0, 0,-1,0, 0,-1,0]);

        gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);

        tri.drawTriangle3DuvNormal([-1,-1,-1, -1,-1,1, -1,1,1], [0,0, 1,0, 1,1], [-1,0,0, -1,0,0, -1,0,0]);
        tri.drawTriangle3DuvNormal([-1,-1,-1, -1,1,1, -1,1,-1], [0,0, 1,1, 0,1], [-1,0,0, -1,0,0, -1,0,0]);

        gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);

        tri.drawTriangle3DuvNormal([1,-1,-1, 1,1,1, 1,-1,1], [0,0, 1,1, 1,0], [1,0,0, 1,0,0, 1,0,0]);
        tri.drawTriangle3DuvNormal([1,-1,-1, 1,1,-1, 1,1,1], [0,0, 0,1, 1,1], [1,0,0, 1,0,0, 1,0,0]);



    }

    /*render(){
        let tri = new Triangle();

        //var xy = this.position;
        var rgba = this.color;
        //var size = this.size;

        gl.uniform1f(u_SelectTexture, this.textureNum);

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        //gl.uniform1f(u_Size, size);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);
        
        tri.drawTriangle3Duv([-1,-1,-1, 1,1,-1, 1,-1,-1] , [0,0, 1,1, 1,0]);
        tri.drawTriangle3Duv([-1,-1,-1, -1,1,-1, 1,1,-1] , [0,0, 0,1, 1,1]);

        //tri.drawTriangle3D([-1,-1,-1, 1,1,-1, 1,-1,-1]);
        //tri.drawTriangle3D([-1,-1,-1, -1,1,-1, 1,1,-1]);

        gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);

        tri.drawTriangle3Duv([-1,1,-1, -1,1,1, 1,1,1], [0,0, 0,1, 1,1]);
        tri.drawTriangle3Duv([-1,1,-1, 1,1,1, 1,1,-1], [0,0, 1,1, 1,0]);

        //tri.drawTriangle3D([-1,1,-1, -1,1,1, 1,1,1]);
        //tri.drawTriangle3D([-1,1,-1, 1,1,1, 1,1,-1]);
        
        gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);
        
        tri.drawTriangle3Duv([-1,-1,1, 1,-1,1, 1,1,1], [0,0, 1,0, 1,1]);
        tri.drawTriangle3Duv([-1,-1,1, 1,1,1, -1,1,1], [0,0, 1,1, 0,1]);

        //tri.drawTriangle3D([-1,-1,1, 1,-1,1, 1,1,1]);
        //tri.drawTriangle3D([-1,-1,1, 1,1,1, -1,1,1]);

        gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);

        tri.drawTriangle3Duv([-1,-1,-1, 1,-1,1, -1,-1,1], [0,0, 1,1, 0,1]);
        tri.drawTriangle3Duv([-1,-1,-1, 1,-1,-1, 1,-1,1], [0,0, 1,0, 1,1]);

        //tri.drawTriangle3D([-1,-1,-1, 1,-1,1, -1,-1,1]);
        //tri.drawTriangle3D([-1,-1,-1, 1,-1,-1, 1,-1,1]);

        gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);

        tri.drawTriangle3Duv([-1,-1,-1, -1,-1,1, -1,1,1], [0,0, 1,0, 1,1]);
        tri.drawTriangle3Duv([-1,-1,-1, -1,1,1, -1,1,-1], [0,0, 1,1, 0,1]);

        //tri.drawTriangle3D([-1,-1,-1, -1,-1,1, -1,1,1]);
        //tri.drawTriangle3D([-1,-1,-1, -1,1,1, -1,1,-1]);

        gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);

        tri.drawTriangle3Duv([1,-1,-1, 1,1,1, 1,-1,1], [0,0, 1,1, 1,0]);
        tri.drawTriangle3Duv([1,-1,-1, 1,1,-1, 1,1,1], [0,0, 0,1, 1,1]);

        //tri.drawTriangle3D([1,-1,-1, 1,1,1, 1,-1,1]);
        //tri.drawTriangle3D([1,-1,-1, 1,1,-1, 1,1,1]);
    }*/

    renderfast(){

        gl.uniform1f(u_SelectTexture, this.textureNum);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // Base color (no repeated shading multipliers)
        const rgba = this.color;
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        const verts = [
            // Front
            -1,-1,-1,  1,1,-1,  1,-1,-1,
            -1,-1,-1, -1,1,-1,  1,1,-1,

            // Top
            -1,1,-1, -1,1,1, 1,1,1,
            -1,1,-1, 1,1,1, 1,1,-1,

            // Back
            -1,-1,1, 1,-1,1, 1,1,1,
            -1,-1,1, 1,1,1, -1,1,1,

            // Bottom
            -1,-1,-1, 1,-1,1, -1,-1,1,
            -1,-1,-1, 1,-1,-1, 1,-1,1,

            // Left
            -1,-1,-1, -1,-1,1, -1,1,1,
            -1,-1,-1, -1,1,1, -1,1,-1,

            // Right
            1,-1,-1, 1,1,1, 1,-1,1,
            1,-1,-1, 1,1,-1, 1,1,1
        ];

        const uvs = [
            0,0, 1,1, 1,0,
            0,0, 0,1, 1,1,

            0,0, 0,1, 1,1,
            0,0, 1,1, 1,0,

            0,0, 1,0, 1,1,
            0,0, 1,1, 0,1,

            0,0, 1,1, 0,1,
            0,0, 1,0, 1,1,

            0,0, 1,0, 1,1,
            0,0, 1,1, 0,1,

            0,0, 1,1, 1,0,
            0,0, 0,1, 1,1
        ];

        this.tri.drawTriangle3Duv(verts, uvs);
    }

    renderfastNormal(){

        gl.uniform1f(u_SelectTexture, this.textureNum);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // Base color (no repeated shading multipliers)
        const rgba = this.color;
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        const verts = [
            // Front
            -1,-1,-1,  1,1,-1,  1,-1,-1,
            -1,-1,-1, -1,1,-1,  1,1,-1,

            // Top
            -1,1,-1, -1,1,1, 1,1,1,
            -1,1,-1, 1,1,1, 1,1,-1,

            // Back
            -1,-1,1, 1,-1,1, 1,1,1,
            -1,-1,1, 1,1,1, -1,1,1,

            // Bottom
            -1,-1,-1, 1,-1,1, -1,-1,1,
            -1,-1,-1, 1,-1,-1, 1,-1,1,

            // Left
            -1,-1,-1, -1,-1,1, -1,1,1,
            -1,-1,-1, -1,1,1, -1,1,-1,

            // Right
            1,-1,-1, 1,1,1, 1,-1,1,
            1,-1,-1, 1,1,-1, 1,1,1
        ];

        const uvs = [
            0,0, 1,1, 1,0,
            0,0, 0,1, 1,1,

            0,0, 0,1, 1,1,
            0,0, 1,1, 1,0,

            0,0, 1,0, 1,1,
            0,0, 1,1, 0,1,

            0,0, 1,1, 0,1,
            0,0, 1,0, 1,1,

            0,0, 1,0, 1,1,
            0,0, 1,1, 0,1,

            0,0, 1,1, 1,0,
            0,0, 0,1, 1,1
        ];

        const normals = [
            0,0,-1, 0,0,-1, 0,0,-1,
            0,0,-1, 0,0,-1, 0,0,-1,

            0,0,-1, 0,0,-1, 0,0,-1,
            0,0,-1, 0,0,-1, 0,0,-1,

            0,0,1, 0,0,1, 0,0,1,
            0,0,1, 0,0,1, 0,0,1,

            0,-1,0, 0,-1,0, 0,-1,0,
            0,-1,0, 0,-1,0, 0,-1,0,

            -1,0,0, -1,0,0, -1,0,0,
            -1,0,0, -1,0,0, -1,0,0,

            1,0,0, 1,0,0, 1,0,0,
            1,0,0, 1,0,0, 1,0,0
        ]

        //this.tri.drawTriangle3Duv(verts, uvs);
        this.tri.drawTriangle3DuvNormal(verts, uvs, normals);
    }
}