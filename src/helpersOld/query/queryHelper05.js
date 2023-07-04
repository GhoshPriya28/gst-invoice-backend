const { sequelize } = require("../../sql-connections/models");
const { getUsersResponseData } = require("../response/parse-response.js");

exports.getDataFromQuery = async (queryString) => {
	return new Promise((resolve, reject) => {
		sequelize.query(queryString, { type: sequelize.QueryTypes.SELECT }).then(queryData => {
			console.log('Query Data', queryData)
			resolve(queryData)
		}).catch(error => {
			console.log('Query Data Error', error)
			reject(error)
		})
	})
}

exports.modifyDataFromQuery = async (queryString, modiifedData) => {
	return new Promise((resolve, reject) => {
		sequelize.query(queryString, { type: sequelize.QueryTypes.UPDATE }).then(queryData => {
			console.log('Query Data', queryData)
			resolve(queryData)
		}).catch(error => {
			console.log('Query Data Error', error)
			reject(error)
		})
	})
}


exports.insertDataFromQuery = async (queryString, insertData) => {
	return new Promise((resolve, reject) => {
		sequelize.query(queryString, { type: sequelize.QueryTypes.INSERT }).then(queryData => {
			console.log('Query Data', queryData)
			resolve(queryData)
		}).catch(error => {
			console.log('Query Data Error', error)
			reject(error)
		})
	})
}

exports.getCustomerNameById = async (customer_id) => {
	return new Promise((resolve, reject) => {
		sequelize.query("SELECT first_name,last_name, customer_id FROM customers WHERE customer_id = '" + customer_id + "'", { type: sequelize.QueryTypes.SELECT }).then(queryData => {
			if (queryData.length > 0) {
				let customer_name = queryData[0].first_name + ' ' + queryData[0].last_name;
				resolve(customer_name)
			}
			else{
				resolve(customer_name='')
			}
		}).catch(error => {
			console.log('Customer Id Error', error)
			reject(error)
		})
	})
}

exports.getUserPicById = async (userId) => {
	return new Promise((resolve, reject) => {
		sequelize.query("SELECT profile_pic FROM users WHERE user_id = '" + userId + "'", { type: sequelize.QueryTypes.SELECT }).then(queryData => {
			console.log('User Id', queryData[0])
			let profilePic = queryData[0].profile_pic
			resolve(profilePic)
		}).catch(error => {
			console.log('User Id Error', error)
			reject(error)
		})
	})
}

exports.getParticipantListByConversationId = async (conversationId) => {
	return new Promise((resolve, reject) => {
		var participants = []
		sequelize.query("SELECT users_id FROM participants WHERE conversation_id = '" + conversationId + "'", { type: sequelize.QueryTypes.SELECT }).then(queryData => {
			console.log('User Id', queryData)
			let participantsIds = queryData
			for (const participant of participantsIds) {
				participants.push(participant.users_id);
			}
			console.log('Prticaipants Array', participants)
			resolve(participants)
		}).catch(error => {
			console.log('User Id Error', error)
			reject(error)
		})
	})
}

exports.getUserDeviceTokenById = async (userId) => {
	return new Promise((resolve, reject) => {
		var deviceTokens = []
		let string = "";
		userId.map((res) => {
			string += "'"
			string += res
			string += "'"
			string += ","

		})
		sequelize.query("SELECT device_token FROM devices WHERE users_id IN (" + string.replace(/,\s*$/, "") + ")", { type: sequelize.QueryTypes.SELECT }).then(queryData => {
			console.log('Device Tokens', queryData)
			let deviceTokenList = queryData
			for (const deviceToken of deviceTokenList) {
				if (deviceToken.device_token) {
					deviceTokens.push(deviceToken.device_token);
				}
			}
			console.log('Device Tokens Array', deviceTokens)
			resolve(deviceTokens)
		}).catch(error => {
			console.log('Device Tokens Error', error)
			reject(error)
		})
	})
}

exports.getAttachmentDetailsByMessageId = async (messageId) => {
	return new Promise((resolve, reject) => {
		sequelize.query("SELECT file_url,file_path,file_name,file_ext FROM attachments WHERE messages_id = '" + messageId + "'", { type: sequelize.QueryTypes.SELECT }).then(queryData => {
			console.log('Attachments Data', queryData)
			let attachmentData = queryData[0]
			resolve(attachmentData)
		}).catch(error => {
			console.log('Attachments Data Error', error)
			reject(error)
		})
	})
}

exports.getRoomIdByConversationId = async (conversationId) => {
	return new Promise((resolve, reject) => {
		sequelize.query("SELECT channel_id FROM conversation WHERE conversation_id = '" + conversationId + "'", { type: sequelize.QueryTypes.SELECT }).then(queryData => {
			console.log('Room Id', queryData[0])
			let roomId = (queryData.length > 0) ? queryData[0].channel_id : ''
			resolve(roomId)
		}).catch(error => {
			console.log('Room Id Error', error)
			reject(error)
		})
	})
}

exports.getOnlineParticipantListByConversationId = async (conversationId, createdBy) => {
	return new Promise((resolve, reject) => {
		var participants = [createdBy]
		sequelize.query("select user_id from users WHERE user_id IN (SELECT users_id FROM participants WHERE conversation_id = '" + conversationId + "') AND is_active = 1", { type: sequelize.QueryTypes.SELECT }).then(queryData => {
			console.log('Online User Id', queryData)
			let participantsIds = queryData
			for (const participant of participantsIds) {
				participants.push(participant.user_id);
			}
			console.log('Online Prticaipants Array', participants)
			resolve(participants)
		}).catch(error => {
			console.log('Online User Id Error', error)
			reject(error)
		})
	})
}

exports.getUserBlockStatusByUserId = async (blockUserId, userId) => {
	return new Promise((resolve, reject) => {
		sequelize.query("SELECT id FROM block_list WHERE users_id = '" + userId + "' AND participants_id = '" + blockUserId + "'", { type: sequelize.QueryTypes.SELECT }).then(queryData => {
			console.log('Query Data', queryData)
			if (queryData.length > 0) {
				resolve(true)
			}
			else {
				resolve(false)
			}
		}).catch(error => {
			console.log('Query Data Error', error)
			reject(error)
		})
	})
}

exports.getUserReportStatusByUserId = async (reportUserId, userId) => {
	return new Promise((resolve, reject) => {
		sequelize.query("SELECT id FROM reports WHERE users_id = '" + userId + "' AND participants_id = '" + reportUserId + "'", { type: sequelize.QueryTypes.SELECT }).then(queryData => {
			console.log('Query Data', queryData)
			if (queryData.length > 0) {
				resolve(true)
			}
			else {
				resolve(false)
			}
		}).catch(error => {
			console.log('Query Data Error', error)
			reject(error)
		})
	})
}

exports.getParticipantDetailsByConversationId = async (conversationId, userId) => {
	return new Promise((resolve, reject) => {
		var participants = []
		sequelize.query("SELECT * FROM users WHERE user_id IN (SELECT users_id FROM participants WHERE conversation_id = '" + conversationId + "') OR user_id IN (SELECT creator_id FROM conversation WHERE conversation_id = '" + conversationId + "')", { type: sequelize.QueryTypes.SELECT }).then(async participantsIds => {
			console.log('User Details By Conversation Id', participantsIds)
			for (const participant of participantsIds) {
				if (participant.user_id != userId) {
					participants.push(participant);
				}
			}
			console.log('User Details By Conversation Id Array', participants)
			resolve(participants)
		}).catch(error => {
			console.log('User Details By Conversation Id Error', error)
			reject(error)
		})
	})
}

exports.getUserConversationId = async (userId, senderId) => {
	let referenceConversationId = await getReferenceConversationId(senderId, userId);
	return new Promise((resolve, reject) => {
		sequelize.query("SELECT conversation_id FROM conversation WHERE reference_conversation_id = '" + referenceConversationId + "' AND chat_type = 1", { type: sequelize.QueryTypes.SELECT }).then(queryData => {
			console.log('Conversation Id', queryData[0])
			let conversationId = (queryData.length > 0) ? queryData[0].conversation_id : 0
			resolve(conversationId)
		}).catch(error => {
			console.log('Conversation Id Error', error)
			reject(error)
		})
	})
}

const getReferenceConversationId = (initiatedBy, participantId) => {
	var participantsId = []
	participantsId.push(participantId)
	const newArray = participantsId
	newArray.push(initiatedBy)
	newArray.sort()
	var referenceConversationId = newArray.join("_");
	console.log('Reference ConversationId', referenceConversationId)
	var participantsId = participantsId.filter((id) => {
		if (id != initiatedBy) {
			return id;
		}
	});
	console.log('part Array', participantsId)
	return referenceConversationId
}

exports.getReadCountByMessageId = async (messageId, userId) => {
	return new Promise((resolve, reject) => {
		sequelize.query("SELECT COUNT(m.message) AS unReadCount FROM messages m INNER JOIN conversation c ON m.conversation_id = c.conversation_id INNER JOIN participants cm ON c.conversation_id = cm.conversation_id LEFT JOIN conversation_read_by rb ON rb.message_id=m.guid WHERE c.reference_conversation_id LIKE '%" + userId + "%' AND rb.message_id IS NULL", { type: sequelize.QueryTypes.SELECT }).then(queryData => {
			console.log('Read Count', queryData[0])
			let readCount = queryData[0].unReadCount
			resolve(readCount)
		}).catch(error => {
			console.log('Read Count Error', error)
			reject(error)
		})
	})
}

exports.getReadStatustByMessageId = async (messageId, userId) => {
	return new Promise((resolve, reject) => {
		sequelize.query("SELECT count(id) as readCount FROM conversation_read_by WHERE message_id = '" + messageId + "' AND user_id = '" + userId + "'", { type: sequelize.QueryTypes.SELECT }).then(queryData => {
			console.log('Read Count Status', queryData[0])
			var readStatus = false
			if (queryData[0].readCount > 0) {
				readStatus = true
			}
			resolve(readStatus)
		}).catch(error => {
			console.log('Read Count Status Error', error)
			reject(error)
		})
	})
}

exports.getMessageDeletedStatustByMessageId = async (messageId, userId) => {
	return new Promise((resolve, reject) => {
		sequelize.query("SELECT COUNT(*) as isDeletedCount FROM `deleted_messages` WHERE messages_id = '" + messageId + "' AND users_id = '" + userId + "'", { type: sequelize.QueryTypes.SELECT }).then(queryData => {
			console.log('Delete Count', queryData[0])
			var deletedStatus = false
			if (queryData[0].isDeletedCount > 0) {
				deletedStatus = true
			}
			resolve(deletedStatus)
		}).catch(error => {
			console.log('Delete Count Error', error)
			reject(error)
		})
	})
}

exports.getAddressDetails = async(customer_id)=>{
	return new Promise((resolve, reject) => {
		sequelize.query("SELECT * FROM address WHERE customer_id = '" + customer_id + "'", { type: sequelize.QueryTypes.SELECT }).then(queryData => {
			console.log('queryData', queryData);
			resolve(queryData)
		}).catch(error => {
			console.log('Customer Id Error', error)
			reject(error)
		})
	})
}