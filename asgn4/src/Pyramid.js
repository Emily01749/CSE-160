class Pyramid {
    constructor() {
        this.type = "pyramid";
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
    }

    render() {
        let tri = new Triangle();
        let rgba = this.color;

        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        let top          = [0, 1, 0];
        let bottom_left  = [-1, -1, -1];
        let bottom_right = [ 1, -1, -1];
        let top_right    = [ 1, -1,  1];
        let top_left     = [-1, -1,  1];

        gl.uniform4f(u_FragColor, rgba[0]*0.6, rgba[1]*0.6, rgba[2]*0.6, rgba[3]);

        tri.drawTriangle3D([
            bottom_left[0], bottom_left[1], bottom_left[2],
            bottom_right[0], bottom_right[1], bottom_right[2],
            top_right[0], top_right[1], top_right[2]
        ]);

        tri.drawTriangle3D([
            bottom_left[0], bottom_left[1], bottom_left[2],
            top_right[0], top_right[1], top_right[2],
            top_left[0], top_left[1], top_left[2]
        ]);

        // --- Side 1 ---
        gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);
        tri.drawTriangle3D([
            top[0], top[1], top[2],
            bottom_left[0], bottom_left[1], bottom_left[2],
            bottom_right[0], bottom_right[1], bottom_right[2]
        ]);

        gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);

        tri.drawTriangle3D([
            top[0], top[1], top[2],
            bottom_right[0], bottom_right[1], bottom_right[2],
            top_right[0], top_right[1], top_right[2]
        ]);

        gl.uniform4f(u_FragColor, rgba[0]*0.85, rgba[1]*0.85, rgba[2]*0.85, rgba[3]);

        tri.drawTriangle3D([
            top[0], top[1], top[2],
            top_right[0], top_right[1], top_right[2],
            top_left[0], top_left[1], top_left[2]
        ]);

        gl.uniform4f(u_FragColor, rgba[0]*0.75, rgba[1]*0.75, rgba[2]*0.75, rgba[3]);

        tri.drawTriangle3D([
            top[0], top[1], top[2],
            top_left[0], top_left[1], top_left[2],
            bottom_left[0], bottom_left[1], bottom_left[2]
        ]);
    }
}
