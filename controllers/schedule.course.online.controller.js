const { CourseOnline } = require("../models/course.online.model");
const { mailer } = require("../helpers/mailer.helper");
const {
  ScheduleCourseOnline,
} = require("../models/schedule.course.online.model");
const { cloneDeep } = require("lodash");
var ObjectID = require("mongodb").ObjectID;
function isEmpty(obj) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}
const getListScheduleCourseOnline = async (req, res) => {
  const query = {};

  if (req.query.query) {
    query.$or = [
      { course_code: { $regex: req.query.query || "", $options: "i" } },
    ];
  }

  try {
    const scheduleCourseOnlineList = await ScheduleCourseOnline.aggregate([
      {
        $lookup: {
          from: "course_onlines",
          localField: "course_id",
          foreignField: "_id",
          as: "courseOnline",
        },
      },
    ]).exec();

    const count = await ScheduleCourseOnline.countDocuments(query);

    return res.json({
      data: scheduleCourseOnlineList,
      total: count,
    });
  } catch (error) {
    return res.json({
      status: "failed",
      message: error,
    });
  }
};

const handleQuery = (_id) => {
  return [
    {
      // $facet creates two branches in the pipeline: checkNull and lookupSchedule.
      $facet: {
        checkNull: [
          {
            $match: {
              studentList: [], // check if the array is null
              _id: _id,
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "studentList",
              foreignField: "_id",
              as: "studentList",
            },
            $lookup: {
              from: "course_onlines",
              localField: "course_id",
              foreignField: "_id",
              as: "courseOnline",
            },
          },
        ],
        lookupSchedule: [
          // Step 1: Match and Unwind studentList
          {
            $match: {
              studentList: { $ne: null }, // check if the array is not null
              _id: _id,
            },
          },
          // Step 2: Lookup user details
          {
            $unwind: "$studentList", // Unwind the products array
          },
          {
            $lookup: {
              from: "users",
              localField: "studentList._id",
              foreignField: "_id",
              as: "studentListObject",
            },
          },

          {
            $unwind: "$studentListObject", // Unwind the productDetails array
          },
          {
            $addFields: {
              studentList: {
                $mergeObjects: ["$studentListObject", "$studentList"],
              },
            },
          },

          // Step 4: unwind studentList.lesson & studentList.lesson.videoList
          {
            $unwind: {
              path: "$studentList.lesson",
              preserveNullAndEmptyArrays: true, // Preserve documents without lessons
            },
          },
          {
            $unwind: {
              path: "$studentList.lesson.videoList",
              preserveNullAndEmptyArrays: true, // Preserve documents without videoList in lesson
            },
          },
          // Step 5: Add ObjectId field for video lookup
          {
            $addFields: {
              "studentList.lesson.videoList.videoObjectId": {
                $toObjectId: "$studentList.lesson.videoList._id",
              },
            },
          },
          {
            $lookup: {
              from: "videos",
              localField: "studentList.lesson.videoList.videoObjectId",
              foreignField: "_id",
              as: "studentList.lesson.videoListDetails",
            },
          },
          {
            $unwind: {
              path: "$studentList.lesson.videoListDetails",
              preserveNullAndEmptyArrays: true, // Preserve documents without lessons
            },
          },
          {
            $addFields: {
              "studentList.lesson.videoListDetails.answerList":
                "$studentList.lesson.videoList.answerList",
            },
          },
          // Step 6: Group back the nested structures
          {
            $group: {
              _id: {
                studentId: "$studentList._id",
                lessonTitle: "$studentList.lesson.title",
                lessonPhase: "$studentList.lesson.phase",
                lessonPermission: "$studentList.lesson.permission",
                lessonTotalTime: "$studentList.lesson.totalTime",
                lessonIsView: "$studentList.lesson.isView",
                lessonPrice: "$studentList.lesson.price",
                lessonPharse: "$studentList.lesson.pharse",
              },
              videoList: { $push: "$studentList.lesson.videoListDetails" },
              scheduleId: { $first: "$_id" },
              course_id: { $first: "$course_id" },
              endTime: { $first: "$endTime" },
              startTime: { $first: "$startTime" },
              ranking: { $first: "$ranking" },
              studentList: { $first: "$studentList" },
            },
          },

          {
            $group: {
              _id: { studentId: "$_id.studentId" },
              lesson: {
                $push: {
                  title: "$_id.lessonTitle",
                  permission: "$_id.lessonPermission",
                  totalTime: "$_id.lessonTotalTime",
                  isView: "$_id.lessonIsView",
                  price: "$_id.lessonPrice",
                  pharse: "$_id.lessonPharse",
                  videoList: "$videoList",
                },
              },
              scheduleId: { $first: "$scheduleId" },
              course_id: { $first: "$course_id" },
              endTime: { $first: "$endTime" },
              startTime: { $first: "$startTime" },
              ranking: { $first: "$ranking" },
              studentList: { $first: "$studentList" },
            },
          },
          {
            $addFields: {
              "studentList.lesson": {
                $sortArray: {
                  input: "$lesson",
                  sortBy: { pharse: 1 },
                },
              },
            },
          },
          {
            $group: {
              _id: "$scheduleId", // Group by order id
              course_id: { $first: "$course_id" }, // Retain customer field
              startTime: { $first: "$startTime" },
              endTime: { $first: "$endTime" },
              ranking: { $first: "$ranking" },
              studentList: { $push: "$studentList" }, // Push back the original products array
            },
          },

          // // Step 8: Lookup courseOnline details
          {
            $lookup: {
              from: "course_onlines",
              localField: "course_id",
              foreignField: "_id",
              as: "courseOnline",
            },
          },

          // //  lookup video details by courseOnline.lesson.videoList
          {
            $unwind: "$courseOnline",
          },
          {
            $unwind: {
              path: "$courseOnline.lesson",
              preserveNullAndEmptyArrays: true, // Preserve documents without lessons
            },
          },
          {
            $unwind: {
              path: "$courseOnline.lesson.videoList",
              preserveNullAndEmptyArrays: true, // Preserve documents without videoList in lesson
            },
          },
          {
            $addFields: {
              "courseOnline.lesson.videoList.videoObjectId": {
                $toObjectId: "$courseOnline.lesson.videoList._id",
              },
            },
          },
          {
            $lookup: {
              from: "videos",
              localField: "courseOnline.lesson.videoList.videoObjectId",
              foreignField: "_id",
              as: "courseOnline.lesson.videoListDetails",
            },
          },
          {
            $unwind: {
              path: "$courseOnline.lesson.videoListDetails",
              preserveNullAndEmptyArrays: true, // Preserve documents without lessons
            },
          },
          // // Group back the nested structures
          {
            $group: {
              _id: {
                scheduleOnlineId: "$_id",
                // save lesson & courseOnline in object _Id
                lessonTitle: "$courseOnline.lesson.title",
                lessonPhase: "$courseOnline.lesson.phase",
                lessonPermission: "$courseOnline.lesson.permission",
                lessonTotalTime: "$courseOnline.lesson.totalTime",
                lessonIsView: "$courseOnline.lesson.isView",
                lessonPrice: "$courseOnline.lesson.price",
                lessonPharse: "$courseOnline.lesson.pharse",
                courseOnlineId: "$courseOnline._id",
                courseOnlineName: "$courseOnline.name",
                courseOnlineTitle: "$courseOnline.title",
                courseOnlinePharse: "$courseOnline.pharse",
                courseOnlineDescription: "$courseOnline.description",
                courseOnlineContent: "$courseOnline.content",
                courseOnlineTotalStudent: "$courseOnline.totalStudent",
                courseOnlineTotalPrice: "$courseOnline.totalPrice",
                courseOnlinePromoPrice: "$courseOnline.promoPrice",
              },
              videoList: {
                $push: "$courseOnline.lesson.videoListDetails",
              },
              course_id: { $first: "$course_id" },
              endTime: { $first: "$endTime" },
              startTime: { $first: "$startTime" },
              ranking: { $first: "$ranking" },
              studentList: { $first: "$studentList" },
            },
          },
          {
            $group: {
              _id: "$_id.scheduleOnlineId",
              course_id: { $first: "$course_id" },
              endTime: { $first: "$endTime" },
              startTime: { $first: "$startTime" },
              ranking: { $first: "$ranking" },
              studentList: { $first: "$studentList" },
              lesson: {
                $push: {
                  title: "$_id.lessonTitle",
                  permission: "$_id.lessonPermission",
                  totalTime: "$_id.lessonTotalTime",
                  isView: "$_id.lessonIsView",
                  price: "$_id.lessonPrice",
                  pharse: "$_id.lessonPharse",
                  videoList: "$videoList",
                },
              },
              courseOnline: {
                $first: {
                  _id: "$_id.courseOnlineId",
                  name: "$_id.courseOnlineName",
                  title: "$_id.courseOnlineTitle",
                  pharse: "$_id.courseOnlinePharse",
                  description: "$_id.courseOnlineDescription",
                  content: "$_id.courseOnlineContent",
                  totalStudent: "$_id.courseOnlineTotalStudent",
                  totalPrice: "$_id.courseOnlineTotalPrice",
                  promoPrice: "$_id.courseOnlinePromoPrice",
                },
              },
            },
          },
          {
            $addFields: {
              "courseOnline.lesson": {
                $sortArray: {
                  input: "$lesson",
                  sortBy: { pharse: 1 },
                },
              },
            },
          },
          // remove lesson  from the top level
          {
            $project: {
              lesson: 0,
            },
          },
        ],
      },
    },
    {
      $project: {
        result: { $concatArrays: ["$checkNull", "$lookupSchedule"] }, // Concatenate the results from both branches
      },
    },
    {
      $unwind: "$result", // Unwind the result array
    },
    {
      $replaceRoot: { newRoot: "$result" }, // Replace the root with the documents from the result array
    },
    // Sort in descending order
    {
      $addFields: {
        studentList: {
          $sortArray: {
            input: "$studentList",
            sortBy: { addAtDate: -1 }, // Sorting by addAtDate in ascending order
          },
        },
      },
    },
    // {
    //   $sort: {
    //     "studentList._id": 1,
    //   },
    // },
  ];
};

const getDetailScheduleCourseOnline = async (req, res) => {
  try {
    const { _id } = req.params;

    const detaildSchedule = await ScheduleCourseOnline.aggregate(
      handleQuery(ObjectID(_id))
    );

    if (isEmpty(detaildSchedule)) {
      return res.json({
        status: "failed",
        message: error,
      });
    } else {
      return res.json({
        data: detaildSchedule,
      });
    }
  } catch (error) {
    return res.json({
      status: "failed",
      message: error,
    });
  }
};

const createScheduleCourseOnline = async (req, res) => {
  const newSchedule = new ScheduleCourseOnline({
    ...req.body,
  });
  const courseOnline = await CourseOnline.find({ _id: newSchedule.course_id });
  await newSchedule.save();
  newSchedule.courseOnline = courseOnline;
  return res.json({
    data: newSchedule,
  });
};

const deleteScheduleCourseOnline = async (req, res) => {
  try {
    // const { _id } = req.params;
    const { _id } = req.params;
    await ScheduleCourseOnline.deleteOne({
      _id: ObjectID(_id),
    });

    return res.json({
      _id: _id,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

const editScheduleCourseOnline = async (req, res) => {
  try {
    const { _id } = req.params;
    const data = req.body;
    await ScheduleCourseOnline.findByIdAndUpdate(
      { _id: ObjectID(_id) },
      {
        startTime: data.startTime,
        endTime: data.endTime,
      }
    );
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error);
  }
};

const editScheduleCourseOnlineHandleUser = async (req, res) => {
  try {
    const { _id } = req.params;
    const data = req.body;
    const studentList = [];
    data &&
      data.length > 0 &&
      data.map((x, idx) => {
        studentList.push({
          _id: ObjectID(x._id),
          lesson: x.lesson,
          fullPermission: x.fullPermission,
        });
      });

    const result = await ScheduleCourseOnline.findByIdAndUpdate(
      { _id: ObjectID(_id) },
      {
        studentList: studentList,
      }
    );
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error);
  }
};
const editScheduleCourseOnlineHandleUserChangePermission = async (req, res) => {
  try {
    const { _id } = req.params;
    const data = req.body;

    const detaildSchedule = await ScheduleCourseOnline.findOne({ _id: _id });

    const studentList = cloneDeep(detaildSchedule.studentList);
    const index = studentList.findIndex(
      (ele) => ele._id.toString() === data.data._id
    );
    if (index !== -1) {
      studentList[index].lesson[data.pharseIndex].permission =
        !studentList[index].lesson[data.pharseIndex].permission;
    }
    await ScheduleCourseOnline.findByIdAndUpdate(
      { _id: ObjectID(_id) },
      {
        studentList: studentList,
      }
    );

    const detaildScheduleMergeData = await ScheduleCourseOnline.aggregate(
      handleQuery(ObjectID(_id))
    );
    const student = detaildScheduleMergeData[0].studentList.find(
      (stu) => stu._id.toString() === data.data._id
    );

    res.status(200).send(student);
  } catch (error) {
    res.status(500).send(error);
  }
};

const editScheduleCourseOnlineHandleAddUserToSchedule = async (req, res) => {
  try {
    // if user already in schedule => return

    const { _id } = req.params;
    const user_id = ObjectID(req.body._id);
    const detaildSchedule = await ScheduleCourseOnline.findOne({ _id: _id });

    // foreach studentList and check user exist .
    // If user exist -> return
    // if user not exits -> unshift user to studentList
    let index = detaildSchedule.studentList.findIndex(
      (stu) => stu._id === user_id
    );
    console.log("user_id", user_id, typeof user_id);
    if (index !== -1) {
      res.status(500).json({
        status: "faild",
        message: "Khách hàng đã tồn tại trong lịch học",
      });
    }
    const currentDate = new Date();
    const data = {
      _id: user_id,
      lesson: req.body.lesson,
      fullPermission: req.body.fullPermission,
      addAtDate: currentDate,
    };
    detaildSchedule.studentList.unshift(data);
    // Get the current date and time

    // Extract components
    // const year = currentDate.getFullYear();
    // const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    // const day = String(currentDate.getDate()).padStart(2, "0");
    // const hours = String(currentDate.getHours()).padStart(2, "0");
    // const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    // const seconds = String(currentDate.getSeconds()).padStart(2, "0");

    // // Combine components into desired format
    // const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    await ScheduleCourseOnline.findByIdAndUpdate(
      { _id: ObjectID(_id) },
      {
        studentList: detaildSchedule.studentList,
      }
    );

    const detaildScheduleMergeData = await ScheduleCourseOnline.aggregate(
      handleQuery(ObjectID(_id))
    );
    const student = detaildScheduleMergeData[0].studentList.find(
      (stu) => stu._id === data._id
    );
    res.status(200).send(student);
  } catch (error) {
    res.status(500).send(error);
  }
};
const editScheduleCourseOnlineHandleDelUserFromSchedule = async (req, res) => {
  try {
    const { _id } = req.params;
    const { user_id } = req.body;
    const detaildSchedule = await ScheduleCourseOnline.findOne({ _id: _id });
    let studentList = detaildSchedule.studentList;
    const index = studentList.findIndex(
      (stu) => stu._id.toString() === user_id
    );
    if (index !== -1) {
      studentList.splice(index, 1);
    }
    await ScheduleCourseOnline.findByIdAndUpdate(
      { _id: ObjectID(_id) },
      {
        studentList: studentList,
      }
    );
    const detaildScheduleMergeData = await ScheduleCourseOnline.aggregate(
      handleQuery(ObjectID(_id))
    );
    res.status(200).send(detaildScheduleMergeData[0].studentList);
  } catch (error) {
    res.status(500).send(error);
  }
};
const editScheduleCourseOnlineHandleUserAnswerQuestion = async (req, res) => {
  try {
    // Extracts _id from the request parameters and lesson and user_id from the request body.
    // Finds the schedule course online with the given _id.
    // Checks if there are students in the schedule course online.
    // If the student with the given user_id exists in the student list, it updates their lesson.
    // If the student with the given user_id doesn't exist in the student list, it adds a new student with the provided lesson.
    // If there are no students in the schedule course online, it adds a new student with the provided lesson.
    // Updates the schedule course online with the modified student list.
    // Sends the updated schedule course online as a response.
    const { _id } = req.params;
    const { lesson, user_id } = req.body;
    const detailScheduleCourseOnline = await ScheduleCourseOnline.findById(
      ObjectID(_id)
    );
    if (detailScheduleCourseOnline.studentList?.length > 0) {
      let index = detailScheduleCourseOnline.studentList.findIndex(
        (stu) => stu._id.toString() === user_id
      );
      if (index !== -1) {
        detailScheduleCourseOnline.studentList[index].lesson = lesson;
      } else {
        let newStudent = {
          _id: ObjectID(user_id),
          lesson: lesson,
          fullPermission: false,
        };
        detailScheduleCourseOnline.studentList.push(newStudent);
      }
    } else {
      let newStudent = {
        _id: ObjectID(user_id),
        lesson: lesson,
        fullPermission: false,
      };
      detailScheduleCourseOnline.studentList.push(newStudent);
    }

    const result = await ScheduleCourseOnline.findOneAndUpdate(
      { _id: ObjectID(_id) },
      { ...detailScheduleCourseOnline },
      { new: true }
    ).exec();

    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};

const scheduleCourseOnlineSendEmailAfterAnswer = async (req, res) => {
  try {
    const { userInfo, pharse } = req.body;
    const correctEmail = userInfo.email.toLowerCase();
    const htmlTemplate = `<div>
        <h1>
          Thông tin học viên
        </h1>

        <h2>Họ Tên: ${userInfo.name}  </h2>
        <h2>EMail: ${userInfo.email}</h2>
        <h2>SDT: ${userInfo.phone}</h2>
        <h2>Phần học: ${pharse}</h2>
  
        <p>Nếu đây là sự nhầm lẫn, bạn có thể bỏ qua. Đây là Email tự động bạn không cần phải phản hồi. Cảm ơn bạn</p>
        </div>
        `;

    mailer(
      "admin@soulretreats.info",
      "HỌC VIÊN HOÀNH THÀNH 1 PHẦN CỦA KHÓA HỌC ONLINE",
      "Thông báo ",
      htmlTemplate
    );
  } catch (error) {
    console.log("error:", error);
  }
};
module.exports = {
  getListScheduleCourseOnline,
  getDetailScheduleCourseOnline,
  createScheduleCourseOnline,
  deleteScheduleCourseOnline,
  editScheduleCourseOnline,
  editScheduleCourseOnlineHandleUser,
  editScheduleCourseOnlineHandleUserChangePermission,
  editScheduleCourseOnlineHandleAddUserToSchedule,
  editScheduleCourseOnlineHandleDelUserFromSchedule,
  editScheduleCourseOnlineHandleUserAnswerQuestion,
  scheduleCourseOnlineSendEmailAfterAnswer,
};
