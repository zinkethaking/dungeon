var Terrain;
(function (Terrain) {
    Terrain[Terrain["Nothing"] = 0] = "Nothing";
    Terrain[Terrain["Wall"] = 1] = "Wall";
})(Terrain || (Terrain = {}));
var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Down"] = 1] = "Down";
    Direction[Direction["Left"] = 2] = "Left";
    Direction[Direction["Right"] = 3] = "Right";
})(Direction || (Direction = {}));
var Room = (function () {
    function Room(xoffset, yoffset, width, height) {
        this.Xoffset = xoffset;
        this.Yoffset = yoffset;
        this.Width = width;
        this.Height = height;
        this.Explored = false;
    }
    return Room;
}());
var Actor = (function () {
    function Actor(y, x) {
        this.Y = y;
        this.X = x;
        this.Direction = Direction.Down;
        this.CanMove = true;
    }
    Actor.prototype.Move = function (direction, map) {
        if (this.Direction == direction) {
            if (this.CanMove) {
                if (direction == Direction.Left && map[this.Y][this.X - 1] == Terrain.Nothing) {
                    this.X--;
                }
                else if (direction == Direction.Right && map[this.Y][this.X + 1] == Terrain.Nothing) {
                    this.X++;
                }
                else if (direction == Direction.Up && map[this.Y - 1][this.X] == Terrain.Nothing) {
                    this.Y--;
                }
                else if (direction == Direction.Down && map[this.Y + 1][this.X] == Terrain.Nothing) {
                    this.Y++;
                }
                this.Wait(200);
            }
        }
        else {
            this.Direction = direction;
        }
    };
    Actor.prototype.Wait = function (timeout) {
        this.CanMove = false;
        var instance = this;
        setTimeout(function () { instance.CanMove = true; }, timeout);
    };
    return Actor;
}());
var Dungeon = (function () {
    function Dungeon(view, overview, mapsize, smallestroom, biggestroom) {
        this.View = view;
        this.Overview = overview;
        this.Mapsize = mapsize;
        this.Smallestroom = smallestroom;
        this.Biggestroom = biggestroom;
        this.Rooms = [];
        this.Map = [];
        this.Roomy = 0;
        this.Roomx = 0;
        this.Zoom = true;
        this.ShowCoordinates = false;
        this.Generate();
    }
    Dungeon.prototype.StandardView = function () {
        this.Overview.style.display = "none";
        this.View.style.display = "table";
        this.Zoom = true;
        this.Render();
    };
    Dungeon.prototype.ZoomView = function () {
        this.Overview.style.display = "table";
        this.View.style.display = "none";
        this.Zoom = false;
        this.Render();
    };
    Dungeon.prototype.Generate = function () {
        while (this.View.lastChild) {
            this.View.removeChild(this.View.lastChild);
        }
        for (var i = 0; i < this.Biggestroom; i++) {
            this.View.appendChild(document.createElement('div'));
            for (var j = 0; j < this.Biggestroom; j++) {
                this.View.children[i].appendChild(document.createElement('div'));
            }
        }
        while (this.Overview.lastChild) {
            this.Overview.removeChild(this.Overview.lastChild);
        }
        for (var i = 0; i < this.Biggestroom * this.Mapsize; i++) {
            this.Overview.appendChild(document.createElement('div'));
            for (var j = 0; j < this.Biggestroom * this.Mapsize; j++) {
                this.Overview.children[i].appendChild(document.createElement('div'));
            }
        }
        for (var i = 0; i < this.Mapsize; i++) {
            this.Rooms.push([]);
            for (var j = 0; j < this.Mapsize; j++) {
                var xoffset = Math.floor(Math.random() * (this.Biggestroom - this.Smallestroom));
                var yoffset = Math.floor(Math.random() * (this.Biggestroom - this.Smallestroom));
                var width = Math.floor(Math.random() * (this.Biggestroom - xoffset - this.Smallestroom)) + this.Smallestroom;
                var height = Math.floor(Math.random() * (this.Biggestroom - yoffset - this.Smallestroom)) + this.Smallestroom;
                for (var k = 0; k < this.Biggestroom; k++) {
                    this.Map.push([]);
                    for (var l = 0; l < this.Biggestroom; l++) {
                        if (xoffset == l && yoffset <= k && yoffset + height > k ||
                            xoffset + width == l && yoffset <= k && yoffset + height > k ||
                            yoffset == k && xoffset <= l && xoffset + width > l ||
                            yoffset + height == k && xoffset <= l && xoffset + width >= l) {
                            this.Map[this.Biggestroom * i + k].push(Terrain.Wall);
                        }
                        else {
                            this.Map[this.Biggestroom * i + k].push(Terrain.Nothing);
                        }
                    }
                }
                this.Rooms[i].push(new Room(j + xoffset, i + yoffset, width, height));
            }
        }
        this.Rooms[0][0].Explored = true;
        this.Player = new Actor(this.Rooms[0][0].Yoffset + 1, this.Rooms[0][0].Xoffset + 1);
        this.StandardView();
    };
    Dungeon.prototype.Render = function () {
        if (!this.Zoom) {
            for (var i = 0; i < this.Mapsize; i++) {
                for (var j = 0; j < this.Mapsize; j++) {
                    for (var k = 0; k < this.Biggestroom; k++) {
                        for (var l = 0; l < this.Biggestroom; l++) {
                            var y_1 = i * this.Biggestroom + k;
                            var x_1 = j * this.Biggestroom + l;
                            if (!this.Rooms[i][j].Explored) {
                                this.Overview.children[y_1].children[x_1].className = "";
                            }
                            else if (this.Map[y_1][x_1] == Terrain.Nothing) {
                                this.Overview.children[y_1].children[x_1].className = "";
                            }
                            else if (this.Map[y_1][x_1] == Terrain.Wall) {
                                this.Overview.children[y_1].children[x_1].className = "wall";
                            }
                        }
                    }
                }
            }
            if (this.Player.Direction == Direction.Down) {
                this.Overview.children[this.Player.Y].children[this.Player.X].className = "playerdown";
            }
            if (this.Player.Direction == Direction.Up) {
                this.Overview.children[this.Player.Y].children[this.Player.X].className = "playerup";
            }
            if (this.Player.Direction == Direction.Left) {
                this.Overview.children[this.Player.Y].children[this.Player.X].className = "playerleft";
            }
            if (this.Player.Direction == Direction.Right) {
                this.Overview.children[this.Player.Y].children[this.Player.X].className = "playerright";
            }
        }
        else {
            var x = this.Roomx * this.Biggestroom;
            var y = this.Roomy * this.Biggestroom;
            for (var i = 0; i < this.Biggestroom; i++) {
                for (var j = 0; j < this.Biggestroom; j++) {
                    if (this.Map[y + i][x + j] == Terrain.Nothing) {
                        this.View.children[i].children[j].className = "";
                        if (this.ShowCoordinates) {
                            this.View.children[i].children[j].style.color = "black";
                            this.View.children[i].children[j].innerHTML = "Y" + (y + i) + "X" + (x + j);
                        }
                        else {
                            this.View.children[i].children[j].innerHTML = "";
                        }
                    }
                    else if (this.Map[y + i][x + j] == Terrain.Wall) {
                        this.View.children[i].children[j].className = "wall";
                        if (this.ShowCoordinates) {
                            this.View.children[i].children[j].style.color = "white";
                            this.View.children[i].children[j].innerHTML = "Y" + (y + i) + "X" + (x + j);
                        }
                        else {
                            this.View.children[i].children[j].innerHTML = "";
                        }
                    }
                }
            }
            if (this.Player.Direction == Direction.Down) {
                this.View.children[this.Player.Y - y].children[this.Player.X - x].className = "playerdown";
            }
            if (this.Player.Direction == Direction.Up) {
                this.View.children[this.Player.Y - y].children[this.Player.X - x].className = "playerup";
            }
            if (this.Player.Direction == Direction.Left) {
                this.View.children[this.Player.Y - y].children[this.Player.X - x].className = "playerleft";
            }
            if (this.Player.Direction == Direction.Right) {
                this.View.children[this.Player.Y - y].children[this.Player.X - x].className = "playerright";
            }
        }
    };
    Dungeon.prototype.RightRoom = function () {
        if (this.Roomx < this.Mapsize - 1) {
            this.Roomx++;
            this.Rooms[this.Roomy][this.Roomx].Explored = true;
        }
        this.Render();
    };
    Dungeon.prototype.LeftRoom = function () {
        if (this.Roomx > 0) {
            this.Roomx--;
            this.Rooms[this.Roomy][this.Roomx].Explored = true;
        }
        this.Render();
    };
    Dungeon.prototype.DownRoom = function () {
        if (this.Roomy < this.Mapsize - 1) {
            this.Roomy++;
            this.Rooms[this.Roomy][this.Roomx].Explored = true;
        }
        this.Render();
    };
    Dungeon.prototype.UpRoom = function () {
        if (this.Roomy > 0) {
            this.Roomy--;
            this.Rooms[this.Roomy][this.Roomx].Explored = true;
        }
        this.Render();
    };
    return Dungeon;
}());
window.onload = function () {
    var container = document.getElementById('container');
    var view = document.getElementById('view');
    var overview = document.getElementById('overview');
    var dungeon = new Dungeon(view, overview, 10, 10, 15);
    document.onkeydown = function (e) {
        switch (e.which || e.keyCode) {
            case 77:
                if (!dungeon.Zoom) {
                    dungeon.StandardView();
                }
                else {
                    dungeon.ZoomView();
                }
            case 37:
                dungeon.LeftRoom();
                break;
            case 38:
                dungeon.UpRoom();
                break;
            case 39:
                dungeon.RightRoom();
                break;
            case 40:
                dungeon.DownRoom();
                break;
            case 65:
                dungeon.Player.Move(Direction.Left, dungeon.Map);
                dungeon.Render();
                break;
            case 87:
                dungeon.Player.Move(Direction.Up, dungeon.Map);
                dungeon.Render();
                break;
            case 83:
                dungeon.Player.Move(Direction.Down, dungeon.Map);
                dungeon.Render();
                break;
            case 68:
                dungeon.Player.Move(Direction.Right, dungeon.Map);
                dungeon.Render();
                break;
            default: return;
        }
        e.preventDefault();
    };
    window.addEventListener("resize", function () {
        container.style.height = "100vh";
        container.style.width = "100vw";
        if (container.clientWidth > container.clientHeight) {
            container.style.width = container.clientHeight + "px";
        }
        else if (container.clientHeight > container.clientWidth) {
            container.style.height = container.clientWidth + "px";
        }
    });
    document.getElementById('coords').onclick = function () {
        dungeon.ShowCoordinates = !dungeon.ShowCoordinates;
        if (dungeon.Zoom) {
            dungeon.StandardView();
        }
        else {
            dungeon.ZoomView();
        }
    };
    if (container.clientWidth > container.clientHeight) {
        container.style.width = container.clientHeight + "px";
    }
    else if (container.clientHeight > container.clientWidth) {
        container.style.height = container.clientWidth + "px";
    }
};
