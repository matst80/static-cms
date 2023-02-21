import { PropsWithChildren } from "react";
import { stop } from "../utils";

export const Dialog = ({ open, children, onClose }: DialogProps) => {
  return open ? (
    <div
      onClick={onClose}
      className="fixed inset-0 z-20 grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm"
    >
      <div
        onClick={stop(() => console.log)}
        className="relative m-4 w-2/5 min-w-[40%] max-w-[40%] rounded-lg bg-white font-sans antialiased shadow-2xl"
      >
        <div className="p-6">{children}</div>
        <div className="flex shrink-0 flex-wrap items-center justify-end p-4">
          <button onClick={stop(onClose)}>Close</button>
        </div>
      </div>
    </div>
  ) : null;
};
type DialogProps = {
  open: boolean;
  onClose: () => void;
} & PropsWithChildren;
