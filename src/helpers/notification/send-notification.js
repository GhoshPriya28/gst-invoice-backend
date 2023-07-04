require('dotenv').config();
const { APP_NAME } = process.env;
const notificationHelper = require("../notification/notification.js");
const queryHelper = require("../query/queryHelper.js");

exports.sendNotifications = async (parameters) => {
    return new Promise(async (resolve, reject) => {        
        let deviceTokens = []        
        let tokenList = await serviceHelper.getUserDetailById(parameters.toUserId,'device_token')            
        deviceTokens.push(tokenList)

		let toSendNotificationParams = {
            to_user : parameters.toUserId,
            from_user : parameters.fromUserId,
            notification : parameters.notification,
        }
        console.log('Notification Body1',toSendNotificationParams)
        await notificationHelper.addNotifications(toSendNotificationParams).then(async addNotification => {
            let payloadData = {
                deviceTokens : deviceTokens,
                title : APP_NAME,
                body : toSendNotificationParams.notification
            }
            await notificationHelper.sendPushNotifications(payloadData).then(async pushNotificationResponse => {
                console.log('Notification Response',pushNotificationResponse)
                resolve(pushNotificationResponse);
            }).catch(pushNotificationError => {
                console.log('Notification Error',pushNotificationError)
                reject(pushNotificationError);
            })
        }).catch(addNotificationError => {
            console.log('Notification Catch Error',addNotificationError)
            reject(addNotificationError);
        })
	})
}

exports.chatNotifications = async (parameters) => {
    return new Promise(async (resolve, reject) => {        
        let deviceTokens = []

        let senderName = await queryHelper.getUserNameById(parameters.fromUserId)
        let senderPic = await queryHelper.getUserPicById(parameters.fromUserId)

        let tokenList = await queryHelper.getUserDeviceTokenById(parameters.toUserId)

		let toSendNotificationParams = {
            to_user : parameters.toUserId,
            from_user : parameters.fromUserId,
            notification : parameters.notification,
        }
        console.log('Notification Body2',toSendNotificationParams)
        console.log('Toke List',tokenList.length)

        let payloadData = {
            deviceTokens : tokenList,
            title : senderName,
            body : toSendNotificationParams.notification
        }

        if(tokenList.length > 0)
        {
            await notificationHelper.sendPushNotifications(payloadData).then(async pushNotificationResponse => {
                console.log('Notification Response 2',pushNotificationResponse)
                resolve(pushNotificationResponse);
            }).catch(pushNotificationError => {
                console.log('Notification Catch Error2',pushNotificationError)
                reject(pushNotificationError);
            })
        }
        else
        {
            console.log('Token List Length Error')
        }
	})
}