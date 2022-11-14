class game {
  constructor(){
    this.init();
    this.loadImage();
    this.loop();
    this.listenMouseEvent();
  }
  init(){
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");
    this.canvas.width = GAME_WIDTH;
    this.canvas.height = GAME_HEIGHT;
    document.body.appendChild(this.canvas);
    
    this.img = null;
    this.pieces = [];

    this.selectedPiece = {};
    this.emptyPiece = { row: 0, col: 0 };
  }

  loadImage(){
    this.img = new Image();
    this.img.onload = () => {
      this.startGame(); }
    this.img.src = "conan.jpg";
  }

  startGame(){
    // Create pieces
    this.pieces = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ]
    for (let row = 0; row < 5; row++){
      for(let col = 0; col < 3; col++){
        let pieceCanvas = document.createElement("canvas");
        pieceCanvas.width = PIECE_SIZE;
        pieceCanvas.height = PIECE_SIZE;
        let pieceContext = pieceCanvas.getContext("2d");

        pieceContext.drawImage(
          this.img,
          col * PIECE_SIZE,
          row * PIECE_SIZE,
          PIECE_SIZE,
          PIECE_SIZE,
          0,
          0,
          PIECE_SIZE,
          PIECE_SIZE
        );
        
        let newPiece = new piece(this, col, row + 1, pieceCanvas);
        this.pieces[row + 1][col] = newPiece;
      }
    }
    
    // Random swap pieces
    for (let rand = 0; rand < 100; rand++){
      console.table(this.pieces);
      this.randomMove();
    }
  }
  randomMove(){
    let rand = Math.round(Math.random() * 3);
    let willMove = null;
    
    switch(rand){
      case 0:
        if (this.emptyPiece.row > 2){
          willMove = {row: this.emptyPiece.row - 1, col: this.emptyPiece.col};
        }
        break;
      case 1:
        if (this.emptyPiece.row < 5){
          willMove = {row: this.emptyPiece.row + 1, col: this.emptyPiece.col};
        }
      break;
      case 2:
        if (this.emptyPiece.col > 0){
          willMove = {row: this.emptyPiece.row, col: this.emptyPiece.col - 1};
        }
      break;
      case 3:
        if (this.emptyPiece.col < 2 && this.emptyPiece.row > 1){
          willMove = {row: this.emptyPiece.row, col: this.emptyPiece.col + 1};
        }
      break;
    }
    if (willMove != null){
      this.swapPiece(willMove, this.emptyPiece);
    }
  }

  swapPiece(piece1, piece2){
    // Lưu lại piece đc di chuyển (selectedPiece)
    let tmp = this.pieces[piece1.row][piece1.col];
    // Chuyển piece trống thành selected piece
    this.pieces[piece2.row][piece2.col] = tmp;
    // Selected piece bây h thành empty
    this.pieces[piece1.row][piece1.col] = null;
    
    this.pieces[piece2.row][piece2.col].col = piece2.col;
    this.pieces[piece2.row][piece2.col].row = piece2.row;

    this.emptyPiece = piece1;
  }

  listenMouseEvent(){
    this.canvas.addEventListener("mousedown", (event) => this.mouseDown(event));
    this.canvas.addEventListener("mouseup", (event) => this.mouseUp(event));
  }
  getMousePos(evt){
    var rect = this.canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  // Coordinate of piece according to the whole picture
  getCoorByMousePos(mousePos){
    return {
      col: Math.floor(mousePos.x / PIECE_SIZE),
      row: Math.floor(mousePos.y / PIECE_SIZE)
    }
  }
  mouseDown(event){
    // Lấy tọa độ của mouse
    let mousePos = this.getMousePos(event);
    // Từ tọa độ mouse -> tọa độ piece -> xác định selected piece
    this.selectedPiece = this.getCoorByMousePos(mousePos);
  }
  mouseUp(event){
    let mousePos = this.getMousePos(event);
    let mouseUpCoor = this.getCoorByMousePos(mousePos);

    if (mouseUpCoor.col != this.emptyPiece.col ||
      mouseUpCoor.row != this.emptyPiece.row){
      return;  
    }
    if ((this.selectedPiece.row == this.emptyPiece.row && (
          this.selectedPiece.col - 1 == this.emptyPiece.col ||
          this.selectedPiece.col + 1 == this.emptyPiece.col)) ||
       (this.selectedPiece.col == this.emptyPiece.col && (
          this.selectedPiece.row - 1 == this.emptyPiece.row ||
          this.selectedPiece.row + 1 == this.emptyPiece.row)))
    {
      this.checkGameState();
      this.swapPiece(this.selectedPiece, mouseUpCoor);
    }  
  }

  checkGameState(){
    let success = true;
    for (let row = 1; row < 6; row++){
      for (let col = 0; col < 3; col++){
        if(row == this.emptyPiece.row && col == this.emptyPiece.col)
          continue;
        if (row != this.pieces[row][col].row || col != this.pieces[row][col].col){
          success = false;
          break;
        } 
      }
    }
    if (success)
      alert("Congratulations! You win");
  }
  loop(){
    this.update();
    this.draw();

    setTimeout(() => {
      this.loop(); }, 20);
  }

  update(){
    this.pieces.forEach( (row) => {
      row.forEach( (piece) => {
        if (piece != null)
          piece.update();
      });
    });
  }

  draw(){
    this.context.fillStyle = "white";
    this.context.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    this.pieces.forEach( (row) => {
      row.forEach( (piece) => {
        if (piece != null)
          piece.draw();
      });
    });
  }
}

var g = new game();
