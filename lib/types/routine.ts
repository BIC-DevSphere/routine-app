export interface Slot {
	startTime: string;
	endTime: string;
	moduleCode: string;
	moduleName: string;
	classType: string;
	room: string;
	teacher: {
		name: string;
		email: string;
	};
	isActive: boolean;
	isJoinedClass: boolean;
	joinedGroups?: string[];
}


export interface WeekDay {
	day: "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";
	slots: Slot[];
}

export interface RoutineData {
	groupId: string;
	groupName: string;
	courseName: string;
	week: WeekDay[];
}

export interface RoutineResponse {
	success: boolean;
	message: string;
	data: RoutineData;
}
