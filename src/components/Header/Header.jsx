import React, {useEffect, useState, useContext} from "react";
import "./Header.modul.scss";
import { Badge, Modal, Button, Checkbox, Form, Input, Drawer, Menu, message } from 'antd';
import { FaShoppingBasket, FaThLarge, FaUser, FaHeart } from "react-icons/fa";
import { RiScalesFill } from "react-icons/ri";
import { IoMenu } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Registration } from "../Registration/Registration";
import { CatalogAPI, AuthAPI, BasketAPI } from "../api/api";
import { SearchBar } from "../SearchBar/SearchBar";
import { MyContext } from "../MyContext/MyContext";

const getItem = (key, label, children) => {
    return{
        key, label, children
    };
}   

export const Header = () => {
    const { toggleState, orderToggleState, registrationToggleState } = useContext(MyContext);
    // message
    const [messageApi, contextHolder] = message.useMessage();
    const success = (login) => {
        messageApi.open({
        type: 'success',
        content: `Привет ${login}, с возвращением!`,
        });
    };
    const registrationSuccess = () => {
        messageApi.open({
            type: 'success',
            content: 'Вы успешно зарегистрированы и авторизированы!',
        });
    }
    const error = (data) => {
        messageApi.open({
          type: 'error',
          content: `${data}`,
        });
      };
    // API 
    const [types, setTypes] = useState([])
    const [subTypes, setSubTypes] = useState([]);
    const [basket, setBasket] = useState();
    const [userId, setUserId] = useState(null);
    const [logginToogle, setLogginToogle] = useState(false);
    //const [data, setData] = useState([]);
    useEffect(() => {
        CatalogAPI.typesReq().then(e => {setTypes(e.data)})
        CatalogAPI.subtypesReq().then(e => {setSubTypes(e.data)})
        if(JSON.parse(localStorage.getItem('user')) !== null) {
            const user_id = JSON.parse(localStorage.getItem('user')).id;
            setUserId(JSON.parse(localStorage.getItem('user')).id);
            if(user_id){
                getBaggeCount({user_id: user_id});
            }
        }
    }, [])
    useEffect(() => {
        if(JSON.parse(localStorage.getItem('user')) !== null)
            setUserId(JSON.parse(localStorage.getItem('user')).id);
    }, [logginToogle]);
    useEffect(() => {
        getBaggeCount({user_id: userId});
        basketFucn();
    }, [userId, toggleState]);

    useEffect(() => {
        basketFucn();
        getBaggeCount({user_id: userId});
    }, [orderToggleState])
    useEffect(() => {
        registrationSuccess();
        setIsModalOpen(false);
        setIsRegModalOpen(false);
    }, [registrationToggleState]);
    /*setInterval(() => {
        const userId = JSON.parse(localStorage.getItem('user')).id;
        if(userId){
            getBaggeCount({userId});
        }
    }, 5000)*/

    const basketFucn = async () =>{
        if(userId !== null) {;
            await BasketAPI.getBasket({user_id: userId}).then(e => {setBasket(e.data)})//.then(await BasketAPI.getProductsInCompaundReq(basket !== null && basket !== undefined?basket[0]: '').then(em => {setData(em.data)}));
            
        }
    }
    const items = types.map(e => getItem(e.id, e.name, e.subtype_id))
    const mapSubtypesToItems = (id) => {
        const a = []
        subTypes.forEach((item)=>{
          if(item.subtype_id === id) {
            a.push(getItem(item.id, item.name))
          }
        });
        return a;
      }
      items.forEach(el =>{
        const a = mapSubtypesToItems(el.key)
        if(a.length > 0){
          el.children=a
        }
      })
    // навигация
    const navigate = useNavigate();
    const toCatalog = (id) => {
        navigate(`/catalog/${id}`)
      };
    
    const handleMenuClick = (key) => {
    // Вы можете добавить здесь дополнительную логику, если это необходимо
        toCatalog(key);
    };
    // модальные окна
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isRegModalOpen, setIsRegModalOpen] = useState(false);
    const showModal = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && (user.status === 'user' || user.status === 'admin')) {
            //toProfile(user.id);
        }
        else{
            setIsModalOpen(true);
        }
    };
    const showRegModal = () => {
        setIsRegModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
      };
    const handkeRegOk = () => {
        setIsRegModalOpen(false);
    };
      const handleCancel = () => {
        setIsModalOpen(false);
      };
    const handleRegCancel = () => {
        setIsRegModalOpen(false);
    };
    const onFinish = async (values) => {
        console.log('Received values of form: ', values);
        await AuthAPI.loginReq(values).catch(e =>  error(e.response.data));
        if(JSON.parse(localStorage.getItem("user") != null)){
            setIsModalOpen(false);
            success(values.login);
            setLogginToogle(!logginToogle);
        } else{
            error('что-то пошло не так');
        }
      };

    const [open, setOpen] = useState(false);
    const showDrawer = () => {
        setOpen(true);
    };
    const onClose = () => {
        setOpen(false);
    };
    // Bage count 
    const [bageCount, setBageCount] = useState();
    const getBaggeCount = async(user_id) => {
        const res = await BasketAPI.getCountOfProductsReq({userId: user_id});
        setBageCount(res.data);
    }
    
    return (
        <div className="header-container">  
        {contextHolder}
            <div className="header-inner-container">
                <div className="logo-container">
                    <Link to='/'>
                        <svg viewBox="0 0 39 12" className="logo" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.868 7.384L3.292 8.848C3.212 9.072 3.14 9.304 3.076 9.544C3.012 9.784 2.944 9.992 2.872 10.168C2.8 10.352
                                2.688 10.496 2.536 10.6C2.392 10.704 2.228 10.78 2.044 10.828C1.86 10.884 1.668 10.908 1.468 10.9C1.276 10.892 
                                1.104 10.856 0.952 10.792C0.608 10.632 0.488 10.368 0.592 10C0.96 8.384 1.304 7.088 1.624 6.112C1.952 5.136 2.22 
                                4.368 2.428 3.808C2.644 3.248 2.868 2.656 3.1 2.032C3.124 1.8 3.22 1.592 3.388 1.408C3.556 1.224 3.752 1.072 3.976 
                                0.952C4.208 0.832 4.448 0.747999 4.696 0.7C4.944 0.643999 5.164 0.635999 5.356 0.676C5.548 0.716 5.688 0.804 5.776 
                                0.939999C5.872 1.076 5.88 1.272 5.8 1.528C5.512 2.264 5.308 2.784 5.188 3.088C5.068 3.392 4.96 3.664 4.864 3.904L4.528 
                                4.696C4.696 4.704 4.908 4.68 5.164 4.624C5.628 4.52 5.964 4.484 6.172 4.516C6.172 4.476 6.192 4.408 6.232 4.312C6.456 
                                3.336 6.708 2.44 6.988 1.624C7.188 0.951999 7.704 0.599999 8.536 0.568C8.864 0.568 9.112 0.648 9.28 0.808C9.464 0.975999 
                                9.488 1.204 9.352 1.492C8.616 3.556 8.096 5.184 7.792 6.376C7.448 7.752 7.22 8.68 7.108 9.16C7.004 9.64 6.912 9.924 6.832 
                                10.012C6.752 10.1 6.668 10.16 6.58 10.192C6.5 10.232 6.42 10.268 6.34 10.3C6.26 10.332 6.196 10.412 6.148 10.54H6.112C6.048 
                                10.684 5.908 10.796 5.692 10.876C5.476 10.956 5.256 10.984 5.032 10.96C4.816 10.944 4.632 10.864 4.48 10.72C4.336 10.584 4.3 
                                10.372 4.372 10.084C4.452 9.628 4.584 9.14 4.768 8.62C4.952 8.092 5.096 7.68 5.2 7.384C5.312 7.088 5.404 6.812 5.476 6.556C5.412 
                                6.588 5.348 6.612 5.284 6.628C5.228 6.644 5.156 6.676 5.068 6.724C4.98 6.764 4.888 6.8 4.792 6.832C4.704 6.864 4.616 6.896 4.528 
                                6.928C4.304 7.016 4.12 7.104 3.976 7.192L3.868 7.384ZM5.224 6.58C5.232 6.58 5.272 6.568 5.344 6.544C5.296 6.56 5.256 6.572 5.224 
                                6.58ZM9.63869 4.804C9.74269 4.54 9.99069 4.36 10.3827 4.264C10.7507 4.168 11.0947 4.18 11.4147 4.3C11.7427 4.428 11.8907 4.636 
                                11.8587 4.924C11.7707 5.204 11.6587 5.548 11.5227 5.956C11.3947 6.356 11.2707 6.768 11.1507 7.192C10.8307 8.28 10.6467 9.048 
                                10.5987 9.496C10.4787 10.216 10.2787 10.604 9.99869 10.66C9.91869 10.676 9.84269 10.688 9.77069 10.696C9.59469 10.704 9.48269 
                                10.752 9.43469 10.84C9.38669 10.928 9.30669 10.992 9.19469 11.032C9.08269 11.08 8.95869 11.1 8.82269 11.092C8.69469 11.092 
                                8.56269 11.06 8.42669 10.996C8.29069 10.94 8.17469 10.856 8.07869 10.744C7.85469 10.472 7.81069 10.108 7.94669 9.652C8.07469 
                                8.78 8.39869 7.672 8.91869 6.328C9.16669 5.664 9.40669 5.156 9.63869 4.804ZM11.9067 3.004C11.5147 3.084 11.1947 3.06 10.9467 
                                2.932C10.7067 2.804 10.5667 2.652 10.5267 2.476C10.4867 2.292 10.5427 2.104 10.6947 1.912C10.8707 1.672 11.1347 1.516 11.4867 
                                1.444C11.6467 1.428 11.7627 1.42 11.8347 1.42C11.9067 1.42 11.9947 1.436 12.0987 1.468C12.3627 1.492 12.5347 1.608 12.6147 
                                1.816C12.7267 1.992 12.7347 2.192 12.6387 2.416C12.5507 2.64 12.3067 2.836 11.9067 3.004ZM13.5782 4.78C13.5942 4.628 13.6902 
                                4.504 13.8662 4.408C14.0422 4.312 14.2382 4.264 14.4542 4.264C14.6702 4.264 14.8782 4.316 15.0782 4.42C15.2862 4.516 15.4262 
                                4.684 15.4982 4.924C16.1782 4.332 16.7982 4.104 17.3582 4.24C17.5502 4.28 17.7142 4.392 17.8502 4.576C18.2582 4.184 18.7102 
                                3.928 19.2062 3.808C19.8302 3.784 20.2782 3.928 20.5502 4.24C20.5902 4.28 20.6302 4.324 20.6702 4.372C20.7822 4.492 20.8462 
                                4.572 20.8622 4.612C21.0062 4.836 21.0462 5.352 20.9822 6.16C20.8942 7.208 20.6942 8.26 20.3822 9.316C20.2142 9.852 20.0622 
                                10.128 19.9262 10.144C19.8462 10.16 19.7702 10.16 19.6982 10.144C19.6342 10.128 19.5742 10.116 19.5182 10.108C19.4702 10.108 
                                19.4422 10.156 19.4342 10.252C19.2742 10.46 19.0302 10.564 18.7022 10.564C18.3822 10.564 18.1102 10.464 17.8862 10.264C17.6382 
                                10.056 17.5502 9.812 17.6222 9.532C17.7022 9.244 17.7902 8.952 17.8862 8.656C17.9822 8.352 18.0862 8.04 18.1982 7.72C18.3902 7.16 
                                18.6022 6.576 18.8342 5.968C18.6662 6.16 18.4382 6.524 18.1502 7.06C17.8622 7.588 17.6822 7.904 17.6102 8.008C17.4742 8.28 17.3622 
                                8.496 17.2742 8.656C17.1862 8.808 17.0662 8.932 16.9142 9.028C16.7702 9.116 16.6342 9.172 16.5062 9.196C16.3862 9.22 16.2702 9.224 
                                16.1582 9.208C15.8942 9.168 15.7062 9.056 15.5942 8.872C15.5702 8.808 15.5462 8.744 15.5222 8.68C15.4982 8.616 15.4782 8.528 15.4622 
                                8.416C15.4382 8.168 15.4702 7.764 15.5582 7.204L15.5342 7.24C15.6302 7.144 15.6622 7.12 15.6302 7.168C15.3102 7.624 15.1182 7.916 
                                15.0542 8.044C14.9902 8.172 14.9222 8.316 14.8502 8.476C14.7782 8.628 14.6942 8.808 14.5982 9.016C14.5022 9.216 14.4262 9.396 14.3702 
                                9.556C14.3142 9.716 14.2462 9.872 14.1662 10.024C13.8062 10.648 13.1742 10.9 12.2702 10.78C12.0782 10.756 11.9142 10.708 11.7782 
                                10.636C11.6422 10.572 11.5862 10.472 11.6102 10.336C11.6742 10.016 11.8222 9.484 12.0542 8.74C12.5102 7.268 12.7822 6.32 12.8702 
                                5.896C12.9262 5.752 12.9742 5.604 13.0142 5.452C13.0622 5.3 13.1102 5.168 13.1582 5.056C13.2542 4.792 13.3942 4.7 13.5782 4.78ZM17.7422 
                                7.744V7.768C17.7582 7.736 17.7582 7.728 17.7422 7.744ZM27.4454 0.952L27.4934 0.964C27.6934 1.084 27.8654 1.22 28.0094 1.372C28.1614 
                                1.516 28.2974 1.672 28.4174 1.84C28.5454 2 28.6454 2.176 28.7174 2.368C29.0214 3.104 28.7574 3.928 27.9254 4.84C27.5734 5.224 27.1774 
                                5.552 26.7374 5.824C26.8494 5.904 26.9534 5.964 27.0494 6.004C27.1534 6.036 27.2974 6.104 27.4814 6.208C27.6654 6.304 27.7854 6.492 
                                27.8414 6.772C27.8974 7.044 27.8814 7.352 27.7934 7.696C27.7134 8.04 27.5614 8.396 27.3374 8.764C27.1214 9.124 26.8374 9.448 26.4854 
                                9.736C25.6854 10.4 24.7574 10.68 23.7014 10.576C23.5494 10.576 23.4534 10.564 23.4134 10.54C23.3734 10.516 23.3414 10.496 23.3174 
                                10.48C23.2934 10.464 23.2414 10.452 23.1614 10.444C22.9614 10.604 22.7334 10.704 22.4774 10.744C22.2214 10.784 21.9774 10.764 21.7454 
                                10.684C21.5214 10.604 21.3294 10.468 21.1694 10.276C21.0174 10.084 20.9414 9.832 20.9414 9.52C20.9654 9.312 21.0054 9.148 21.0614 
                                9.028C21.0374 8.956 21.0254 8.868 21.0254 8.764C21.2974 7.316 21.5534 6.208 21.7934 5.44C22.2814 3.912 22.8094 2.76 23.3774 1.984C23.8414 
                                1.328 24.4854 0.903999 25.3094 0.711999C26.1014 0.527999 26.8134 0.608 27.4454 0.952ZM23.7134 9.328C23.8094 9.304 23.8894 9.3 23.9534 
                                9.316C24.0254 9.324 24.1094 9.32 24.2054 9.304C24.4374 9.28 24.7494 9.136 25.1414 8.872C25.3894 8.624 25.5214 8.38 25.5374 8.14C25.5534 
                                7.9 25.5174 7.748 25.4294 7.684C25.3414 7.612 25.2214 7.576 25.0694 7.576C24.9254 7.576 24.7614 7.6 24.5774 7.648C24.4014 7.688 24.2294 
                                7.712 24.0614 7.72V7.744C24.0214 7.904 23.9814 8.044 23.9414 8.164C23.9014 8.284 23.8654 8.4 23.8334 8.512C23.7614 8.776 23.7054 9.048 
                                23.6654 9.328H23.7134ZM25.9454 3.088C25.7054 3.056 25.4454 3.244 25.1654 3.652C24.9894 3.908 24.8534 4.296 24.7574 4.816C24.9254 4.744 
                                25.0894 4.684 25.2494 4.636C25.4174 4.58 25.5734 4.52 25.7174 4.456C26.0694 4.304 26.3214 4.12 26.4734 3.904C26.6494 3.696 26.7054 3.52 
                                26.6414 3.376C26.5454 3.248 26.3894 3.132 26.1734 3.028C26.1094 3.084 26.0334 3.104 25.9454 3.088ZM25.7654 3.04H25.8014H25.7654ZM32.3169 
                                8.224C32.1649 8.296 32.0169 8.352 31.8729 8.392C31.7289 8.432 31.5609 8.472 31.3689 8.512C30.8649 8.616 30.5009 8.676 30.2769 8.692C30.3009 
                                8.772 30.4209 8.868 30.6369 8.98C30.7809 9.004 30.9369 8.984 31.1049 8.92C31.2809 8.848 31.4609 8.784 31.6449 8.728C31.8369 8.664 32.0209 
                                8.628 32.1969 8.62C32.3809 8.612 32.5529 8.68 32.7129 8.824C32.7769 8.968 32.8289 9.052 32.8689 9.076C32.9089 9.1 32.9449 9.112 32.9769 
                                9.112C33.0089 9.112 33.0449 9.124 33.0849 9.148C33.1249 9.172 33.1809 9.264 33.2529 9.424C33.3329 9.584 33.3129 9.736 33.1929 9.88C33.0809 
                                10.024 32.9049 10.148 32.6649 10.252C32.4249 10.356 32.1449 10.44 31.8249 10.504C31.5049 10.568 31.1849 10.612 30.8649 10.636C30.1449 
                                10.692 29.5969 10.636 29.2209 10.468C28.6769 10.284 28.3249 9.92 28.1649 9.376C27.9569 8.656 28.0729 7.816 28.5129 6.856C28.7129 6.408 
                                29.0289 5.928 29.4609 5.416C29.8369 4.968 30.2569 4.644 30.7209 4.444C31.2569 4.212 31.8169 4.104 32.4009 4.12C33.0249 4.136 33.4569 
                                4.408 33.6969 4.936C33.8169 5.216 33.8409 5.608 33.7689 6.112C33.6409 6.768 33.4729 7.232 33.2649 7.504C33.0569 7.768 32.7409 8.008 
                                32.3169 8.224ZM31.6209 6.328C31.1969 6.24 30.8649 6.48 30.6249 7.048C30.5529 7.2 30.4969 7.36 30.4569 7.528C30.7289 7.56 31.0169 7.408 
                                31.3209 7.072C31.4329 6.936 31.5169 6.8 31.5729 6.664C31.6289 6.52 31.6449 6.408 31.6209 6.328ZM36.27 9.532C36.222 9.7 36.166 9.848 36.102 
                                9.976C36.038 10.104 35.942 10.224 35.814 10.336C35.686 10.448 35.534 10.552 35.358 10.648C35.182 10.752 35.014 10.824 34.854 10.864C34.486 
                                10.944 34.294 10.836 34.278 10.54C34.254 10.46 34.202 10.412 34.122 10.396C34.05 10.388 33.982 10.368 33.918 10.336C33.75 10.264 33.702 10.068 
                                33.774 9.748C33.902 9.308 34.042 8.776 34.194 8.152C34.346 7.52 34.542 6.828 34.782 6.076C35.35 4.252 36.054 2.608 36.894 1.144C36.95 1.072 
                                37.014 0.98 37.086 0.868C37.158 0.748 37.25 0.64 37.362 0.543999C37.642 0.287999 37.986 0.227999 38.394 0.364C38.386 0.468 38.41 0.564 38.466 
                                0.651999C38.522 0.731999 38.586 0.816 38.658 0.904C38.842 1.112 38.926 1.3 38.91 1.468C38.062 3.476 37.298 5.72 36.618 8.2C36.538 8.488 36.474 
                                8.74 36.426 8.956C36.378 9.172 36.326 9.364 36.27 9.532Z"/>
                        </svg>
                    </Link>
                    <IoMenu className="menu" size={FaThLarge} onClick={showDrawer}/>
                </div>
                <div className="search-bar-header-container">
                    <div className="search-bar-header-inner-container">
                        <SearchBar/>
                    </div>
                </div>
                <div className="general-buttons-container">
                    <Link to={`user/${userId !== null? userId : ''}/compare`}>
                        <RiScalesFill className="favorites" size={FaThLarge}/>
                    </Link>
                    <Link to={`user/${userId !== null? userId : ''}/favorites`}>
                        <FaHeart className="favorites" size={FaThLarge}/>
                    </Link>
                    <Link to={JSON.parse(localStorage.getItem('user')) !== null? `/profile/${JSON.parse(localStorage.getItem('user')).id}` : ''} >
                        <FaUser size={FaThLarge} onClick={showModal} className="user"/>
                    </Link >
                    <Link to={`/basket/${basket !== null && basket !== undefined ? basket[0] : ''}`}>
                        {bageCount ? 
                        <Badge className="badge" overflowCount={999} count={bageCount} offset={[-20, 20]}>
                            <FaShoppingBasket className="basket" onClick={basketFucn} size={FaThLarge}/>                    
                        </Badge>
                        :
                        <Badge className="badge" overflowCount={999} count={0} offset={[-20, 20]}>
                            <FaShoppingBasket className="basket" onClick={basketFucn} size={FaThLarge}/>                    
                        </Badge>
                        }
                    </Link>
                </div>
            </div>
            <Modal className="modal-login-form"
            title="Sign-in"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={null}
            closable={false}
            >
                <Form
                name="normal_login"
                className="login-form"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                >
                    <Form.Item
                        name="login"
                        rules={[
                        {
                            required: true,
                            message: 'Please input your Username!',
                        },
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                        {
                            required: true,
                            message: 'Please input your Password!',
                        },
                        ]}
                    >
                        <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item id="remember-forgot">
                    <Form.Item name="remember" valuePropName="checked" noStyle style={{ margin: 0 }}>
                    <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                        <a className="login-form-forgot" href="">
                        Forgot password
                        </a>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                        Log in
                        </Button> <br />
                        Or <Button type="text" onClick={showRegModal}>register now!</Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                className="modal-registration-form"
                title='Sign-up'
                open={isRegModalOpen}
                onOk={handkeRegOk}
                onCancel={handleRegCancel}
                footer={null}
                closable={false}
            >
                <Registration />
            </Modal>
            <Drawer
              title="Catalog"
              placement="left"
              onClose={onClose}
              open={open}
            >
                <Menu
                mode="inline"
                items={items}
                onClick={({ key }) => {handleMenuClick(key);  onClose()}}
                >
                 {items.map(el => (
                <Menu.Item key={el.key} onClick={() => handleMenuClick(el.key)}>
                  <Link to={`/catalog/${el.key}`}>{el.label}</Link>
                </Menu.Item>    
              ))}   
                </Menu>
            </Drawer>
        </div>
        )
}