// ===== Modules ===== //
const cron = require('node-cron');
// ===== Models ===== //
const Details = require('./models/details.model');
const Store = require('./models/store.model');

const task = cron.schedule(process.env.DB_CRON_EXECUTION_TIME, () => {
	console.log(
		'CRON JOB was started with time : ' + Date(Date.now).toString()
	);

	Store.find({ twenty_four: false }).then((doc) => {
		doc.forEach((Store) => {
			console.log('Capacity Updated for the store: ' + Store.name);
			const res = Details.updateMany(
				{ _id: storeModel.details[0] },
				{ capacity: 0 },
				function (err, affected) {
					if (err) {
						console.log(
							'Error while executing the CRON job: ' + err
						);
					}
				}
			);
		});
		console.log('Total No of store  updated:' + doc.length);
	});

	task.start();
});
