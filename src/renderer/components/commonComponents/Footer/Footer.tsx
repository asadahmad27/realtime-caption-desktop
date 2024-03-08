import React from 'react';
import { Layout } from 'antd';
const { Footer: AntdFooter } = Layout;
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useTranslation } from 'react-i18next';
import './Footer.css';

const Footer: React.FC = () => {
  const sidebarCondition: boolean = useSelector(
    (state: RootState) => state.booksData.sidebarOpen,
  );
  const { t } = useTranslation();

  return (
    <AntdFooter className={sidebarCondition ? 'marginRightCustom' : ''}>
      <div className="footerContent">
        {t('Copyright 2023. All Rights Reserved.')}
      </div>
    </AntdFooter>
  );
};

export default Footer;
