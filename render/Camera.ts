import Vector3 from "../math/Vector3";
import Matrix4 from "../math/Matrix4";

const v0 = Vector3.create();
const v1 = Vector3.create();

function radians(v) : number {
	return v*Math.PI/180;
}

export default class Camera {

	private readonly position: Float32Array;
	private readonly forward : Float32Array;
	private readonly up: Float32Array;

	matrix = Matrix4.create();
	viewMatrix = Matrix4.create();

	advanceAmount = 0;
	strafeAmount = 0;
	upAmount = 0;

	private yaw = 0;
	private pitch = 0;

	constructor() {
		this.position = Vector3.createFromCoords(0,0,3);
		this.forward = Vector3.createFromCoords(0,0,0);
		this.up = Vector3.createFromCoords(0,1,0);

		this.anglesFrom(0,0);
	}

	setup(pos: Float32Array, forward: Float32Array, up: Float32Array) {
		Vector3.copy(this.position, pos);
		Vector3.copy(this.forward, Vector3.normalize(v0,forward));
		Vector3.copy(this.up, Vector3.normalize(v0,up));
		this.anglesFrom(0,0);
	}

	lookAt() {
		if (this.advanceAmount!==0) {
			this.advance(this.advanceAmount*.25);
		}
		if (this.strafeAmount!==0) {
			this.strafe(this.strafeAmount*.25);
		}
		if (this.upAmount!==0) {
			this.moveUp(this.upAmount*.25);
		}
		Matrix4.lookAt(this.matrix, this.position, Vector3.add(v0, this.position, this.forward), this.up);
		Matrix4.viewMatrix(this.viewMatrix, this.matrix);
	}

	advance(amount: number) {
		Vector3.add(
			this.position,
			this.position,
			Vector3.mul(v0, this.forward, amount));
	}

	strafe(amount: number) {
		Vector3.add(
			this.position,
			this.position,
			Vector3.mul(
				v0,
				Vector3.normalize(
					v0,
					Vector3.cross(v0, this.forward, this.up)),
				amount));
	}

	moveUp(amount: number) {

		// right
		Vector3.normalize(
			v0,
			Vector3.cross(v0, this.forward, this.up));

		// up
		Vector3.normalize(
			v1,
			Vector3.cross(v1, this.forward, v0));

		Vector3.add(
			this.position,
			this.position,
			Vector3.mul(v1, v1, amount));
	}

	anglesFrom(ix: number, iy: number) {

		this.yaw += ix;
		this.pitch -= iy;

		if (this.pitch>89) { this.pitch=89; }
		if (this.pitch<-89) { this.pitch=-89; }

		v0[0] = Math.cos(radians(this.pitch)) * Math.cos(radians(this.yaw));
		v0[1] = Math.sin(radians(this.pitch));
		v0[2] = Math.cos(radians(this.pitch)) * Math.sin(radians(this.yaw));

		Vector3.normalize(this.forward, v0);
	}
}