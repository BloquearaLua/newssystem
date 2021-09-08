import React from 'react'
import { withRouter } from 'react-router-dom';
import { Form, Button, Input, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import Particles from "react-tsparticles";
import axios from 'axios';
import './index.css'

function Login(props) {
    const onFinish = (user) => {
        // console.log(user);
        axios.get(`/users?username=${user.username}&password=${user.password}&roleState=true&_expand=role`).then(res => {
            // console.log(res.data);
            if (res.data.length === 0) {
                message.error('用户名或密码错误！');
            } else {
                localStorage.setItem('token', JSON.stringify(res.data[0]));
                props.history.push('/home');
            }
        })
    }
    return ( <div style = {{ background: 'rgb(35,39,65)', height: '100%' } } >
        <Particles options = {
            {
                "background": {
                    "color": {
                        "value": "rgb(35,39,65)"
                    },
                    "position": "50% 50%",
                    "repeat": "no-repeat",
                    "size": "cover"
                },
                "fullScreen": {
                    "enable": true,
                    "zIndex": 1
                },
                "interactivity": {
                    "events": {
                        "onClick": {
                            "enable": true,
                            "mode": "push"
                        },
                        "onHover": {
                            "enable": true,
                            "mode": "repulse",
                            "parallax": {
                                "force": 60
                            }
                        }
                    },
                    "modes": {
                        "bubble": {
                            "distance": 400,
                            "duration": 2,
                            "opacity": 0.8,
                            "size": 40
                        },
                        "grab": {
                            "distance": 400
                        }
                    }
                },
                "particles": {
                    "color": {
                        "value": "#ffffff"
                    },
                    "links": {
                        "color": {
                            "value": "#ffffff"
                        },
                        "distance": 150,
                        "enable": true,
                        "opacity": 0.4
                    },
                    "move": {
                        "attract": {
                            "rotate": {
                                "x": 600,
                                "y": 1200
                            }
                        },
                        "enable": true,
                        "outModes": {
                            "bottom": "out",
                            "left": "out",
                            "right": "out",
                            "top": "out"
                        }
                    },
                    "number": {
                        "density": {
                            "enable": true
                        },
                        "value": 80
                    },
                    "opacity": {
                        "value": {
                            "min": 0.1,
                            "max": 0.5
                        },
                        "animation": {
                            "enable": true,
                            "speed": 1,
                            "minimumValue": 0.1
                        }
                    },
                    "shape": {
                        "options": {
                            "character": {
                                "value": [
                                    "t",
                                    "s",
                                    "P",
                                    "a",
                                    "r",
                                    "t",
                                    "i",
                                    "c",
                                    "l",
                                    "e",
                                    "s"
                                ],
                                "font": "Verdana",
                                "style": "",
                                "weight": "400",
                                "fill": true
                            },
                            "char": {
                                "value": [
                                    "t",
                                    "s",
                                    "P",
                                    "a",
                                    "r",
                                    "t",
                                    "i",
                                    "c",
                                    "l",
                                    "e",
                                    "s"
                                ],
                                "font": "Verdana",
                                "style": "",
                                "weight": "400",
                                "fill": true
                            }
                        },
                        "type": "char"
                    },
                    "size": {
                        "value": 16,
                        "animation": {
                            "speed": 10,
                            "minimumValue": 10
                        }
                    },
                    "stroke": {
                        "width": 1,
                        "color": {
                            "value": "#ffffff",
                            "animation": {
                                "h": {
                                    "count": 0,
                                    "enable": false,
                                    "offset": 0,
                                    "speed": 1,
                                    "sync": true
                                },
                                "s": {
                                    "count": 0,
                                    "enable": false,
                                    "offset": 0,
                                    "speed": 1,
                                    "sync": true
                                },
                                "l": {
                                    "count": 0,
                                    "enable": false,
                                    "offset": 0,
                                    "speed": 1,
                                    "sync": true
                                }
                            }
                        }
                    }
                }

            }
        } />
        <div className = 'loginContainer' >
            <h2 > 全球新闻发布管理系统 </h2>
            <Form name = "normal_login"
                className = "login-form"
                initialValues = {
                    { remember: true } }
                onFinish = { onFinish } >
                <Form.Item name = "username"
                    rules = {
                        [{ required: true, message: '请输入您的用户名！' }] } >
                    <Input prefix = { <UserOutlined className = "site-form-item-icon" / > }
                    placeholder = "请输入用户名" / >
                </Form.Item>
                <Form.Item name = "password"
                    rules = {
                    [{ required: true, message: '请输入您的密码！' }] } >
                    <Input prefix = { <LockOutlined className = "site-form-item-icon" / > }
                    type = "password"
                    placeholder = "请输入密码" />
                </Form.Item>
                <Form.Item >
                <Button type = "primary"
                    htmlType = "submit"
                    className = "login-form-button" >
                登录</Button> 
                </Form.Item>
            </Form> 
        </div>
    </div>
    )
}
export default withRouter(Login);