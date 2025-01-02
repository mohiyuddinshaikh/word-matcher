import React from "react";
import ReactDOM from "react-dom";
import "./Modal.scss";

interface ModalProps {
  isOpen: boolean;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, children }) => {
  //   useEffect(() => {
  //     const handleEscape = (event: KeyboardEvent) => {
  //       if (event.key === "Escape") {
  //         onClose();
  //       }
  //     };
  //     document.addEventListener("keydown", handleEscape);
  //     return () => document.removeEventListener("keydown", handleEscape);
  //   }, [onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="modal-overlay"
      //  onClick={onClose}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* <button className="modal-close" onClick={onClose}>
          ×
        </button> */}
        {title && <h2 className="modal-title">{title}</h2>}
        <div className="modal-body">{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
