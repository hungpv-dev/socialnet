import classNames from "classnames/bind";
import { useParams } from 'react-router-dom';
import styles from "./main.scss";
import SlideBar from "../../components/Messages/SlideBar";
import useChatRoom from "@/hooks/useChatRoom";
import { useEffect, useState } from "react";
import Echo from "laravel-echo";
import io from 'socket.io-client';
const cx = classNames.bind(styles);


function LayoutMessages({children}) {
    useEffect(() => {
        let access_token = localStorage.getItem('access_token');
        window.Echo = new Echo({
            broadcaster: 'socket.io',
            client: io,
            host: 'http://localhost:6001',
            authEndpoint: '/broadcasting/auth',
            authHost: 'http://localhost:8000',
            auth: {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }
        });
        // Lắng nghe sự kiện khi kết nối WebSocket thành công
        window.Echo.connector.socket.on('connect', () => {
            console.log('WebSocket connected successfully.');
        });

        // Lắng nghe sự kiện khi bị ngắt kết nối WebSocket
        window.Echo.connector.socket.on('disconnect', () => {
            console.log('WebSocket disconnected.');
        });

        // Lắng nghe sự kiện lỗi
        window.Echo.connector.socket.on('error', (error) => {
            console.error('WebSocket error:', error);
        });

        window.Echo.channel('messages.1010')
            .listen('MessagesSendEvent', (event) => {
                console.log('Event received:', event);
            });

        // Clean up khi component unmounts
        return () => {
            window.Echo.disconnect();
        };
    }, []);

    










    const chatRoom = useChatRoom();
    const [rooms,setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await chatRoom.index();
                setRooms(response.data); 
            } catch (error) {
                console.error("There was a problem with the fetch operation:", error);
            } finally {
                setLoading(false); 
            }
        };
        fetchRooms();
    }, []);

    if (loading) {
        return <div>Loading...</div>; 
    }
    console.log(rooms)

    return (
        <div id="messages" className={cx("messages",{'content-messages':!id})}>
            <SlideBar rooms={rooms} />
            {children}
        </div>
    );
}

export default LayoutMessages
