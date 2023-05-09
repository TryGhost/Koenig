import {SignupNode as BaseSignupNode, INSERT_SIGNUP_COMMAND} from '@tryghost/kg-default-nodes';
import {ReactComponent as ImageCardIcon} from '../assets/icons/kg-card-type-image.svg';
export {INSERT_SIGNUP_COMMAND} from '@tryghost/kg-default-nodes';

export class SignupNode extends BaseSignupNode {
    static kgMenu = [{
        label: 'Signup',
        desc: 'Adds signup card',
        Icon: ImageCardIcon,
        insertCommand: INSERT_SIGNUP_COMMAND,
        matches: ['signup'],
        isHidden: ({config}) => !config?.feature?.signupCard
    }];
}
