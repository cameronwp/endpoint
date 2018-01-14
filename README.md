# Endpoint

_Abstracts socket.io messaging into a simpler interface._

This is the base class inherited by [client-endpoint](https://github.com/cameronwp/client-endpoint) and [server-endpoint](https://github.com/cameronwp/server-endpoint).

```sh
npm i -S @cameronwp/endpoint
```

## API

### Classes

<dl>
<dt><a href="#Endpoint">Endpoint</a></dt>
<dd></dd>
</dl>

### Functions

<dl>
<dt><a href="#onmessage">onmessage(type, [historical])</a> ⇒ <code>subscription</code></dt>
<dd><p>Subscribe an action to perform when a message is received.</p>
</dd>
<dt><a href="#onchange">onchange()</a> ⇒ <code>subscription</code></dt>
<dd><p>Subscribe an action to perform when the connection changes.</p>
</dd>
<dt><a href="#clear">clear()</a></dt>
<dd><p>Remove all subscriptions to connection events.</p>
</dd>
</dl>

### Typedefs

<dl>
<dt><a href="#connectionCallback">connectionCallback</a> : <code>function</code></dt>
<dd><p>Connection callback.</p>
</dd>
<dt><a href="#changeCallback">changeCallback</a> : <code>function</code></dt>
<dd><p>Changed connction callback.</p>
</dd>
<dt><a href="#messageResponse">messageResponse</a> : <code>function</code></dt>
<dd><p>Message response callback.</p>
</dd>
</dl>

<a name="Endpoint"></a>

### Endpoint
**Kind**: global class
<a name="new_Endpoint_new"></a>

#### new Endpoint()
Base class for handling socket.io connections.

<a name="onmessage"></a>

### onmessage(type, [historical]) ⇒ <code>subscription</code>
Subscribe an action to perform when a message is received.

**Kind**: global function

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| type | <code>string</code> |  |  |
|  | [<code>messageResponse</code>](#messageResponse) |  |  |
| [historical] | <code>boolean</code> | <code>false</code> | Whether or not to call the listener if this message has been received before this listener was set. |

<a name="onchange"></a>

### onchange() ⇒ <code>subscription</code>
Subscribe an action to perform when the connection changes.

**Kind**: global function

| Type |
| --- |
| [<code>changeCallback</code>](#changeCallback) |

<a name="clear"></a>

### clear()
Remove all subscriptions to connection events.

**Kind**: global function
<a name="connectionCallback"></a>

### connectionCallback : <code>function</code>
Connection callback.

**Kind**: global typedef

| Param | Type | Description |
| --- | --- | --- |
| sID | <code>string</code> | Socket ID. |

<a name="changeCallback"></a>

### changeCallback : <code>function</code>
Changed connction callback.

**Kind**: global typedef

| Param | Type | Description |
| --- | --- | --- |
| count | <code>number</code> | Number of connections |

<a name="messageResponse"></a>

### messageResponse : <code>function</code>
Message response callback.

**Kind**: global typedef

| Param | Type |
| --- | --- |
| response | <code>any</code> |

