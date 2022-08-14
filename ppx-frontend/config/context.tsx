import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

export const ModalContext = createContext<{
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
}>({ show: false, setShow: () => null });

export const ModalProvider: React.FC = ({ children }) => {
  const [show, setShow] = useState(false);

  return (
    <ModalContext.Provider value={{ show, setShow }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => useContext(ModalContext);
