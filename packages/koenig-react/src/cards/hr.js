import cardRenderer from '../utils/card-renderer';

const HrComponent = () => {
    return <hr />;
};

const HrCard = {
    name: 'hr',
    component: HrComponent,
    type: 'dom',
    render: cardRenderer(HrComponent)
};

export default HrCard;
