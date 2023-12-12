import React from 'react';
import './personnel.css';
import logo from '../../../images/logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';

function Personnel() {
    return (
        <div>
            <div className="main-content">
                <div className="content-header">
                    <div className="header-content">
                        <h2>บุคลากร</h2>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="card custom-card-style">
                                <img
                                    src={logo}
                                    className="card-img-top"
                                    alt="ข่าวสารที่ 1"
                                />
                                <div className="card-body">
                                    <h5 className="card-title">รศ. ดร.ธรา อั่งสกุล</h5>
                                    <p className="card-text">Admin</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card custom-card-style">
                                <img
                                    src={logo}
                                    className="card-img-top"
                                    alt="ข่าวสารที่ 2"
                                />
                                <div className="card-body">
                                    <h5 className="card-title">อ. ดร. ทรงยุทธ เพิ่มผล</h5>
                                    <p className="card-text">Admin</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card custom-card-style">
                                <img
                                    src={logo}
                                    className="card-img-top"
                                    alt="ข่าวสารที่ 3"
                                />
                                <div className="card-body">
                                    <h5 className="card-title">อ. อรรคพล วงศ์กอบลาภ</h5>
                                    <p className="card-text">Admin</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Personnel;