class Cube{
    constructor(){
        this.type = "cube";
        //this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        //this.size = 5.0;
        //this.segments = 10;
        this.matrix = new Matrix4();
    }

    render(){
        let tri = new Triangle();

        //var xy = this.position;
        var rgba = this.color;
        //var size = this.size;

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        //gl.uniform1f(u_Size, size);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        /*var delta = this.size/200.0;

        let angStep = 360/this.segments;
        for(var angle = 0; angle < 360; angle = angle + angStep){
            let center = [xy[0], xy[1]];
            let angleA = angle;
            let angleB = angle + angStep;
            let vectA =  [Math.cos(angleA * Math.PI / 180)* delta, Math.sin(angleA * Math.PI/180)* delta];
            let vectB =  [Math.cos(angleB * Math.PI / 180)* delta, Math.sin(angleB * Math.PI/180)* delta];
            let pt1 = [center[0] + vectA[0], center[1] + vectA[1]];
            let pt2 = [center[0] + vectB[0], center[1] + vectB[1]];

            tri.drawTriangle([xy[0], xy[1], pt1[0], pt1[1], pt2[0], pt2[1]])
        }*/
       gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);
        
        tri.drawTriangle3D([0,0,0, 1,1,0, 1,0,0]);
        tri.drawTriangle3D([0,0,0, 0,1,0, 1,1,0]);

        gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);

        tri.drawTriangle3D([0,1,0, 0,1,1, 1,1,1]);
        tri.drawTriangle3D([0,1,0, 1,1,1, 1,1,0]);
        
        gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);
        
        tri.drawTriangle3D([0,0,1, 1,0,1, 1,1,1]);
        tri.drawTriangle3D([0,0,1, 1,1,1, 0,1,1]);

        gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);

        tri.drawTriangle3D([0,0,0, 1,0,1, 0,0,1]);
        tri.drawTriangle3D([0,0,0, 1,0,0, 1,0,1]);

        gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);

        tri.drawTriangle3D([0,0,0, 0,0,1, 0,1,1]);
        tri.drawTriangle3D([0,0,0, 0,1,1, 0,1,0]);

        gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);

        tri.drawTriangle3D([1,0,0, 1,1,1, 1,0,1]);
        tri.drawTriangle3D([1,0,0, 1,1,0, 1,1,1]);

    }
}