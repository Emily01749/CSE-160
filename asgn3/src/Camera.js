class Camera{
    constructor(){
        this.fov = 60; // field of view

        this.eye = new Vector3([0, 0, 0]);
        this.at = new Vector3([0, 0, -1]);
        this.up = new Vector3([0, 1, 0]);
        //this.eye = new Vector3([0, 0, 3]);
        //this.at = new Vector3([0, 1, 0]);
        //this.up = new Vector3([0, 1, 0]);

        this.viewMatrix = new Matrix4();

        //viewMatrix.setLookAt(
        // g_camera.eye.elements[0],g_camera.eye.elements[1],g_camera.eye.elements[2],  
        // g_camera.at.elements[0],g_camera.at.elements[1],g_camera.at.elements[2],  
        // g_camera.up.elements[0],g_camera.up.elements[1],g_camera.up.elements[2]
        // ); // eye, at, up

        this.projectionMatrix = new Matrix4();
        //this.projectionMatrix.setPerspective(this.fov, canvas.width/canvas.height, 0.1, 1000);
    }

    viewPerspective(){
        this.viewMatrix.setLookAt(
            this.eye.elements[0], this.eye.elements[1], this.eye.elements[2], 
            this.at.elements[0], this.at.elements[1], this.at.elements[2], 
            this.up.elements[0], this.up.elements[1], this.up.elements[2]
        );

        this.projectionMatrix.setPerspective(50, canvas.width/canvas.height, 1, 100);
    }

    moveForward(){
        // f = at - eye
        let f = new Vector3();
        console.log("this.at", this.at);
        f = f.set(this.at);
        f.sub(this.eye);
        f.normalize();

        let speed = -1;
        f.mul(speed);
        this.eye = this.eye.add(f);
        this.at = this.at.add(f);
        console.log("aft add", this.at, this.eye);
    }

    moveBackwards(){
        // b = eye - at
        let b = new Vector3();
        b = b.set(this.eye);
        b.sub(this.at);
        b.normalize();

        let speed = -1;
        b.mul(speed);
        this.eye = this.eye.add(b);
        this.at = this.at.add(b);
        console.log("aft add", this.at, this.eye);
    }
}