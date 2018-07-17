var mongoose = require('mongoose');
var House = mongoose.model('House');

exports.publish = function(req, res) {
	var _house = req.body.house;
	house = new House(_house);
	house.save(function(err) {
		if (err) {
			console.log(err);
		} else {
			res.send('suc');
		}
	});
};
exports.getDetail = function(req, res) {
	var houseId = req.body.id;
	House.findById(houseId, function(err, data) {
		res.send(data);
	})
};
exports.saveImg = function(req, res) {
	res.send(req.files);
};
exports.search = function(req, res) {
	var obj = req.body;
	var key,
		searchData = {};
	for (key in obj) {
		if (obj[key] !== '') {
			if (key === 'city') {
				searchData['address.city'] = obj[key];
			} else if (key === 'state') {
				searchData['address.state'] = obj[key];
			} else if (key === 'peopleNum') {
				searchData['peopleNum'] = obj[key];
			} else if (key === 'houseType') {
				searchData['houseType'] = obj[key];
			} else if (key === 'roomType') {
				searchData['roomType'] = obj[key];
			} else if (key === 'moneyRange') {
				searchData['moneyRange'] = obj[key];
			} else if (key === 'areaRange') {
				searchData['areaRange'] = obj[key];
			}
		}
	}
	if (obj.where !== '') {
		var location = [];
		var locationIndex = [];
		var keyWord = obj.where;
		var result = [];
		House.find(searchData, function(err, data) {
			data.forEach(function(obj) {
				location.push(obj.address.city + obj.address.state + obj.address.road);
			});
			location.forEach(function(value, index) {
				if (value.indexOf(keyWord) !== -1) {
					locationIndex.push(index);
				}
			});
			locationIndex.forEach(function(value) {
				result.push(data[value]);
			});
			res.send(result);
		});
	} else {
		House.find(searchData, function(err, data) {
			res.send(data);	
		})
	}
};
exports.getHomeInfo = function (req, res) {
	var userId = req.body.id;
	if (userId) {
		House.find({userId: userId}, function(err, data) {
			res.send(data);
		});
	} else {
		House.find({}, function(err, data) {
			res.send(data);
		});
	}

};
exports.delHouse = function(req, res) {
	var houseId = req.body.houseId;
	House.remove({_id: houseId}, function(err, doc) {
		if (err) {
			console.log(err);
		}
	});
	res.send("done");
}