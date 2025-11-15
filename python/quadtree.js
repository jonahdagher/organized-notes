class Quadtree{
    constructor(x1, x2, y1, y2, max_depth, max_objects){

        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;

        this.midX = (this.x1+this.x2)/2
        this.midY = (this.y1+this.y2)/2

        this.max_depth = max_depth;
        this.max_objects = max_objects;

        this.objects = new Set()

        //Nodes numbers are like graph quadrants (counter clockwise starting with 1 in pos x, pos y)
        this.node1 = null;
        this.node2 = null;
        this.node3 = null;
        this.node4 = null;
    }

    toBBox(obj){
        return {x1: obj.left, y1, x2: x1+width, y2: y1+height}
    }

    //top right bias for equals 

    add_rect(obj){
        if ( ((obj.width) > (this.midX - this.x1)) || ((obj.height) > (this.midY - this.y1))){ // if the rectangles bbox is larger than any child nodes
            this.objects.add(obj)
        }

        else if (( this.objects.size < this.max_objects) || this.max_depth === 0){
            this.objects.add(obj)
        }

        else if (!this.node1) {
            this.node1 = Quadtree(this.midX, this.x2, this.y1, this.midY, this.max_depth-1, this.max_objects)
            this.node2 = Quadtree(this.x1, this.midX, this.y1, this.midY, this.max_depth-1, this.max_objects)
            this.node3 = Quadtree(this.x1, this.midX, this.midY, this,y2, this.max_depth-1, this.max_objects)
            this.node4 = Quadtree(this.midX, this.x2, this.midY, this.y2, this.max_depth-1, this.max_objects)
        }

        else {
            if (obj.left > this.midX && (obj.left + obj.width) < this.x2){
                if (obj.top){
                    
                }
            }
        }
    }
}
