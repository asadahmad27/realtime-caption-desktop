import React, { ReactNode } from 'react';
import { Layout, theme } from 'antd';
import { Footer, Navbar } from '../../commonComponents';
import './PrimaryLayout.css';

const { Content } = Layout;
interface PrimaryLayoutProps {
  children: ReactNode;
}

const PrimaryLayout: React.FC<PrimaryLayoutProps> = ({ children }) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout className="mainLayout">
      <Navbar />
      <Content>
        <div
          style={{ background: colorBgContainer }}
          className="contentContainer"
        >
          {children}
        </div>
      </Content>
      <Footer />
    </Layout>
  );
};

export default PrimaryLayout;
