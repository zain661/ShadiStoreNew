import React from 'react';
import { useState, useEffect } from 'react';
import './EmbroideryPage.css';
import image1 from '../Assets/home1.png';
import image2 from '../Assets/home2.png';
import image3 from '../Assets/home3.png';
import image4 from '../Assets/home4.png';
import image5 from '../Assets/home5.png';


const images = [image1, image2, image3, image4, image5];

const EmbroideryPage = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section>
            <div className="container">
                <div className="left">
                    <div className="text-container">
                        <h1>شادي للأزياء والمطرزات الفلسطينية</h1>
                        <h2>
                            من <span className="highlight">التراث</span> إلى الموضة<br />
                            <span className="highlight">مطرزات فلسطينية</span> تجمع بين الماضي والحاضر
                        </h2>
                        
                    </div>
                    <div className='h3'>
                    <h3>خدمة التوصيل إلى معظم مناطق فلسطين: الضفة، القدس، الداخل المحتل</h3>
                    <br/>
                    <h4 className='h3'> جنين
                    عمارة الجرباوي -شارع بور سعيد- دخلة سوق الحسبة القديم</h4>
                    </div>
                    
                </div>
                <div className="right">
                    <div className='image-container'>
                        <img src={images[currentImageIndex]} alt="Embroidery" />
                    </div>
                </div>
            </div>
        </section>

    );
};

export default EmbroideryPage;
