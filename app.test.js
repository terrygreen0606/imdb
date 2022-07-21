// Unit testing for demonstration purpose

const request = require("supertest");
const app = require("./app");

describe("Movies API", () => {
	it("GET /movies --> Returns an object with the success, and result key (result includes the array of filtered movies)", () => {
		return request(app)
			.get("/movies")
			.expect("Content-Type", /json/)
			.expect(200)
			.then((res) => {
				expect(res.body).toEqual(
					expect.objectContaining({
						success: expect.any(Boolean),
						result: expect.any(Array),
					})
				);
			});
	});
});
