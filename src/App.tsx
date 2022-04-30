import React, { useRef, useEffect, ReactComponentElement } from "react";
import { drawStroke, clearCanvas, setCanvasSize } from "./utils/canvasUtils";
import { useSelector, useDispatch } from "react-redux";
import { beginStroke, endStroke, updateStroke } from "./actions";
import { RootState } from "./utils/types";
import { currentStrokeSelector } from "./rootReducer";
import { ColorPanel } from "./shared/ColorPanel";
import "./App.css";

const WIDTH = 1024;
const HEIGHT = 768;

function App() {
  const currentStroke = useSelector(currentStrokeSelector);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getCanvasWithContext = (canvas = canvasRef.current) => {
    return { canvas, context: canvas?.getContext("2d") };
  };

  const isDrawing = !!currentStroke.points.length;

  const dispatch = useDispatch();

  const startDrawing = ({
    nativeEvent,
  }: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = nativeEvent;
    dispatch(beginStroke(offsetX, offsetY));
  };

  const endDrawing = () => {
    if (isDrawing) {
      dispatch(endStroke());
    }
  };

  const draw = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) {
      return;
    }
    const { offsetX, offsetY } = nativeEvent;

    dispatch(updateStroke(offsetX, offsetY));
  };

  useEffect(() => {
    const { canvas, context } = getCanvasWithContext();
    if (!canvas || !context) {
      return;
    }

    setCanvasSize(canvas, WIDTH, HEIGHT);

    context.lineJoin = "round";
    context.lineCap = "round";
    context.lineWidth = 5;
    context.strokeStyle = "black";

    clearCanvas(canvas);
  }, []);

  useEffect(() => {
    const { context } = getCanvasWithContext();
    if (!context) {
      return;
    }
    requestAnimationFrame(() =>
      drawStroke(context, currentStroke.points, currentStroke.color)
    );
  }, [currentStroke]);

  return (
    <div className="window">
      <div className="title-bar">
        <div className="title-bar-text">Redux Paint</div>

        <div className="title-bar-controls">
          <button aria-label="Close" />
        </div>
      </div>
      <ColorPanel />
      <canvas
        onMouseDown={startDrawing}
        onMouseUp={endDrawing}
        onMouseOut={endDrawing}
        onMouseMove={draw}
        ref={canvasRef}
      />
    </div>
  );
}

export default App;