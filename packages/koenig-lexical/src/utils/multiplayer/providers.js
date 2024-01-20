import {SocketIOProvider} from './SocketIOProvider.js';
import {WebsocketProvider} from 'y-websocket';

const yWebsocketProvider = (doc, multiplayerEndpoint, multiplayerDocId, id) => new WebsocketProvider(
    multiplayerEndpoint,
    multiplayerDocId + '/' + id,
    doc,
    {connect: false}
);

const ySocketIOProvider = (doc, multiplayerEndpoint, multiplayerDocId, id, url = new URL(multiplayerEndpoint)) => new SocketIOProvider(url.origin, doc, {
    autoConnect: false
}, {path: url.pathname, query: {id: multiplayerDocId + '/' + id}});

export default {
    'y-websocket': yWebsocketProvider,
    'y-socket.io': ySocketIOProvider
};
