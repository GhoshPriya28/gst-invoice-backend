
const { firebaseAdmin } = require('../../config/firebase-config')

exports.sendPushNotifications = async (payloadData) => {
    var payload = {
        notification: {
          title: payloadData.title,
          body: payloadData.body
        },
        data: {
          title: payloadData.title,
          body: payloadData.body
        },
        webpush: {
          fcmOptions: {
            link: 'notificationScreen'
          }
        },
        android: {
          notification: {
            sound: 'default',
            clickAction: 'notificationScreen',
          },
        },
        apns: {
          payload: {
            aps: {
              badge: 1,
              sound: 'default'
            },
          },
        },
        tokens : payloadData.deviceTokens,
        options : {
            priority: "high",
            timeToLive: 60 * 60 *24
        }
    }
    console.log('Push Notification Body',payload)
    return new Promise((resolve, reject) => {
		firebaseAdmin.messaging().sendMulticast(payload).then(async sendNotificationData => { 
      console.log("Successfully sent push notification:", sendNotificationData);
      console.log("Successfully sent push notification error:", sendNotificationData.responses[0].error);
			resolve(sendNotificationData)
		}).catch(error => {
        console.log("Error sending push notification:", error);
			reject(error)
		})
	})
}

exports.getNotificationMessage = async function (notifictaion,params = null)
{
    return new Promise((resolve, reject) => {
		console.log('Notification',notifictaion)
        console.log('Parameters',params)
        if(params)
        {
          var notifictaion1 = ""
          var k = 0          
          for(var i = 0;i < notifictaion.length;i++)
          {
            if(notifictaion[i] == "%") 
            {
              notifictaion1 = notifictaion1 + params[k]
              k++
              i++
            }
            else
            {
              notifictaion1 = notifictaion1 + notifictaion[i]
            }
          }
          console.log('Final Notification For Send',notifictaion1)
          resolve(notifictaion1)
        }
        else{
          console.log('Final Notification For Send',notifictaion)
          resolve(notifictaion)
        }
	})
}