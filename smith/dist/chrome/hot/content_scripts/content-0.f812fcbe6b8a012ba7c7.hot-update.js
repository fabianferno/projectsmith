"use strict";
self["webpackHotUpdatesmith"]("content_scripts/content-0",{

/***/ "./content/components/Chat.tsx":
/*!*************************************!*\
  !*** ./content/components/Chat.tsx ***!
  \*************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ethers */ "./node_modules/ethers/lib.esm/providers/provider-jsonrpc.js");
/* harmony import */ var _utils_ChatGPTABI_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/ChatGPTABI.json */ "./content/utils/ChatGPTABI.json");
/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ethers */ "./node_modules/ethers/lib.esm/wallet/wallet.js");
/* harmony import */ var ethers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ethers */ "./node_modules/ethers/lib.esm/contract/contract.js");
/* provided dependency */ var __react_refresh_utils__ = __webpack_require__(/*! ./node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js */ "./node_modules/@pmmmwh/react-refresh-webpack-plugin/lib/runtime/RefreshUtils.js");
/* provided dependency */ var __react_refresh_error_overlay__ = __webpack_require__(/*! ./node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js */ "./node_modules/@pmmmwh/react-refresh-webpack-plugin/overlay/index.js");
__webpack_require__.$Refresh$.runtime = __webpack_require__(/*! ./node_modules/react-refresh/runtime.js */ "./node_modules/react-refresh/runtime.js");

var _jsxFileName = "E:\\projects\\Hacks\\projectsmith\\smith\\content\\components\\Chat.tsx",
  _s = __webpack_require__.$Refresh$.signature();




const galadriel = {
  id: 696969,
  name: "Galadriel Devnet",
  iconUrl: "https://framerusercontent.com/images/cm2XdkhbP9YP9hqP2vt72ByxUI.png",
  iconBackground: "#1d4ed8",
  nativeCurrency: {
    name: "Galadriel",
    symbol: "GAL",
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: ["https://devnet.galadriel.com"]
    }
  },
  blockExplorers: {
    default: {
      name: "explorer",
      url: "https://explorer.galadriel.com"
    }
  }
};
const ChatComponent = ({
  data
}) => {
  _s();
  const [input, setInput] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)("");
  const [messages, setMessages] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [chatId, setChatId] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const privateKey = "eeada91a80020324fc8fb214966f5f07d15116c48bd44b426564894edd7db0b7";
  const contractAddress = "0xbb28197bccAA45A19dBedC67eFf63c86Ac92Fd2b";
  const provider = new ethers__WEBPACK_IMPORTED_MODULE_2__.JsonRpcProvider(galadriel.rpcUrls.default.http[0]);
  const wallet = new ethers__WEBPACK_IMPORTED_MODULE_3__.Wallet(privateKey, provider);
  const contract = new ethers__WEBPACK_IMPORTED_MODULE_4__.Contract(contractAddress, _utils_ChatGPTABI_json__WEBPACK_IMPORTED_MODULE_1__, wallet);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const initializeChat = async () => {
      if (chatId === null) {
        alert("Starting chat with current context...");
        const transactionResponse = await contract.startChat(`
            You are a blockchain data analyst and your task is to analyze the following data:

            ${JSON.stringify(data)}

            Use the context and answer my following questions:
        `);
        const receipt = await transactionResponse.wait();
        const newChatId = getChatId(receipt, contract);
        setChatId(newChatId);
        console.log(`Chat started with ID: ${newChatId}`);
      }
    };
    initializeChat();
  }, [chatId]);
  const handleMessageSubmit = async e => {
    console.log("Sending message...");
    e.preventDefault();
    if (!input.trim()) return;
    const transactionResponse = await contract.addMessage(input, chatId);
    const receipt = await transactionResponse.wait();
    console.log(`Message sent, tx hash: ${receipt.transactionHash}`);
    await fetchMessages();
    setInput("");
  };
  const fetchMessages = async () => {
    console.log("Fetching messages...");
    try {
      const messages = await contract.getMessageHistoryContents(chatId);
      const roles = await contract.getMessageHistoryRoles(chatId);
      const newMessages = messages.map((message, i) => ({
        role: roles[i],
        content: message
      }));
      setMessages(newMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  const handleInputChange = e => {
    setInput(e.target.value);
  };
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("div", {
    className: "max-w-md mx-auto mt-10",
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 90,
      columnNumber: 10
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("form", {
    onSubmit: handleMessageSubmit,
    className: "flex gap-2",
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 91,
      columnNumber: 7
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("input", {
    type: "text",
    value: input,
    onChange: handleInputChange,
    placeholder: "Type your message here...",
    className: "flex-1 p-2 border rounded-lg",
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 92,
      columnNumber: 9
    }
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
    onClick: fetchMessages,
    className: "bg-blue-500 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded mx-1",
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 93,
      columnNumber: 9
    }
  }, "\uD83D\uDD03"), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("button", {
    type: "submit",
    className: "bg-blue-500 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded",
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 96,
      columnNumber: 9
    }
  }, "Send Message")), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("ul", {
    className: "mt-4 space-y-2 h-[30vh] overflow-y-auto",
    style: {
      maxHeight: "30vh"
    },
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 100,
      columnNumber: 7
    }
  }, messages.map((msg, index) => /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("li", {
    key: index,
    className: `p-3 overflow-hidden rounded ${msg.role === "user" ? "bg-blue-900" : "bg-slate-700"}`,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 103,
      columnNumber: 39
    }
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement("strong", {
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 104,
      columnNumber: 13
    }
  }, msg.role, ":"), " ", msg.content))));
};
_s(ChatComponent, "Su6lHRa0tvnmn2FjkKuvAOdLg9c=");
_c = ChatComponent;
function getChatId(receipt, contract) {
  for (const log of receipt.logs) {
    try {
      const parsedLog = contract.interface.parseLog(log);
      if (parsedLog && parsedLog.name === "ChatCreated") {
        return parseInt(parsedLog.args[1]);
      }
    } catch (error) {
      console.error("Could not parse log:", log);
    }
  }
  return null;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ChatComponent);
var _c;
__webpack_require__.$Refresh$.register(_c, "ChatComponent");

const $ReactRefreshModuleId$ = __webpack_require__.$Refresh$.moduleId;
const $ReactRefreshCurrentExports$ = __react_refresh_utils__.getModuleExports(
	$ReactRefreshModuleId$
);

function $ReactRefreshModuleRuntime$(exports) {
	if (true) {
		let errorOverlay;
		if (typeof __react_refresh_error_overlay__ !== 'undefined') {
			errorOverlay = __react_refresh_error_overlay__;
		}
		let testMode;
		if (typeof __react_refresh_test__ !== 'undefined') {
			testMode = __react_refresh_test__;
		}
		return __react_refresh_utils__.executeRuntime(
			exports,
			$ReactRefreshModuleId$,
			module.hot,
			errorOverlay,
			testMode
		);
	}
}

if (typeof Promise !== 'undefined' && $ReactRefreshCurrentExports$ instanceof Promise) {
	$ReactRefreshCurrentExports$.then($ReactRefreshModuleRuntime$);
} else {
	$ReactRefreshModuleRuntime$($ReactRefreshCurrentExports$);
}

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("3d45f091220cdfcd72bb")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=content-0.f812fcbe6b8a012ba7c7.hot-update.js.map