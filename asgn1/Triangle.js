class Triangle{
    constructor(){
        this.type = "triangle";
        this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.size = 5.0;
    }

    //initVertexBuffers(gl) {
    drawTriangle(vertices){
        /*var vertices = new Float32Array([
            0, 0.5,   -0.5, -0.5,   0.5, -0.5
        ]);*/
        var n = 3; // The number of vertices

        // Create a buffer object
        var vertexBuffer = gl.createBuffer();
        if (!vertexBuffer) {
            console.log('Failed to create the buffer object');
            return -1;
        }

        // Bind the buffer object to target
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

        var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
        if (a_Position < 0) {
            console.log('Failed to get the storage location of a_Position');
            return -1;
        }
        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);

        gl.drawArrays(gl.TRIANGLES, 0, n);

        //return n;
    }

    render(){
        var xy = this.position;
        var rgba = this.color;
        var size = this.size;

        console.log("Rending triangle ", rgba, xy[0], xy[1], size);

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniform1f(u_Size, size);

        var delta = this.size/200.0;
        this.drawTriangle([xy[0], xy[1], xy[0] + delta, xy[1], xy[0], xy[1] + delta]);
    }
}