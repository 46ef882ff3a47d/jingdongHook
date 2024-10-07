// ==UserScript==
// @name         jingdong
// @version      2024-10-06
// @description  京东找回密码提示身份证Hook插件
// @author       Evelyn
// @match        https://idt.jd.com/*
// ==/UserScript==

(function() {
    'use strict';
    function createNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'custom-notification';
        notification.innerHTML = `${message} <button class="copy-btn">点击复制</button>`;
        document.body.appendChild(notification);
        document.querySelector('.copy-btn').addEventListener('click', function() {
            const button = this;
            const textarea = document.createElement('textarea');
            textarea.value = message;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            button.textContent = '复制成功';
        });
        setTimeout(() => {
            notification.remove();
        }, 30000);
    }
    document.head.appendChild(document.createElement('style')).innerHTML = `
        .custom-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #333;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            z-index: 10000;
            opacity: 0.9;
        }
        .copy-btn {
            margin-left: 10px;
            background: #555;
            border: none;
            color: white;
            padding: 5px 10px;
            cursor: pointer;
        }
    `;
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        this.addEventListener('load', function() {
            if (url === 'https://m-acp.jd.com/acp/user/getCredentialsInfo') {
                try {
                    const responseJSON = JSON.parse(this.responseText);
                    const message = responseJSON.message === "成功" ?
                        `${responseJSON.data.credentialsName} ${responseJSON.data.credentialsNo}` :
                        `Response: ${this.responseText}`;
                    createNotification(message);
                } catch (error) {
                    createNotification(error);
                }
            }
        });
        return originalOpen.apply(this, [method, url, ...rest]);
    };
})();

