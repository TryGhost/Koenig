import createComponentCard from '../utils/create-component-card';
import Card from '../components/Card';

const ImageCardComponent = ({...props}) => {
    const payload = props?.payload;
    return (
        <Card
            className="kg-card-hover"
            isSelected={props.isSelected}
            isEditing={props.isEditing}
            selectCard={props.selectCard}
            deselectCard={props.deselectCard}
            editCard={props.editCard}
            hasEditMode={true}
            editor={props.editor}
        >
            <div>

            </div>
            <div className='__mobiledoc-card' contentEditable="false">
                <img src={payload?.src || `https://images.unsplash.com/photo-1524612219806-a2423c90e45e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80`} alt={payload?.alt || 'image alt description'} />
            </div>
        </Card>
    );
};

const ImageCard = createComponentCard({
    name: 'image',
    component: ImageCardComponent,
    koenigOptions: {
        hasEditMode: true,
        selectAfterInsert: true
    }
});

export default ImageCard;
