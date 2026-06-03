import React from "react";
import { Container } from "react-bootstrap";


type Props = {
  children: React.ReactNode;
};

const MainLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
     
      <Container className="mt-3">{children}</Container>
    </>
  );
};

export default MainLayout;