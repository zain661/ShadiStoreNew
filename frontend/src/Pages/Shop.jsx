import EmbroideryPage from '../Components/EmbroideryPage/EmbroideryPage';
import CategoriesPage from '../Components/CategoriesPage/CategoriesPage';
import SubscriptionSection from '../Components/SubscriptionSection/SubscriptionSection';
import FooterSection from '../Components/FooterSection/FooterSection';

const Shop = () => {
    return (
        <div>
            <EmbroideryPage />
            <CategoriesPage />
            <SubscriptionSection />
            {/* <InstagramFollowSection/> */}
        <FooterSection />
    </div>
    );
};

export default Shop;
