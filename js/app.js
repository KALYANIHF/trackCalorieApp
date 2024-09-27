class TrackCalorie {
  #calorieLimit = 2000;
  #totalCalories = 0;
  #meals = [];
  #workout = [];
  constructor() {
    document.addEventListener("DOMContentLoaded", () => {
      this.#calorieLimit = this.#getStroage("calorieLimit");
      this.#totalCalories = this.#getStroage("totalCalories");
      this.#meals = this.#getStroage("meals");
      this.#workout = this.#getStroage("workout");
      // console.log(this.#calorieLimit);
      // console.log(this.#totalCalories);
      // console.log(this.#meals);
      // console.log(this.#workout);
      this.#displayCaloriesTotal();
      this.#displayCaloriesConsumed();
      this.#displayCaloriesBurned();
      this.#displayCaloriesRemain();
      this.#calculateProgressBar();
      if (this.#meals.length !== 0) {
        this.#meals.forEach((meal) => this.#showMeal(meal));
      }
      if (this.#workout.length !== 0) {
        this.#workout.forEach((workout) => this.#showWorkOut(workout));
      }
    });
    document
      .querySelector("#limit-form")
      .addEventListener("submit", this.#setCalorieLimit.bind(this));
    document
      .querySelector("#reset")
      .addEventListener("click", this.#resetCaloriesData.bind(this));
    document
      .querySelector("#meal-form")
      .addEventListener("submit", this.addMeal.bind(this));
    document
      .querySelector("#workout-form")
      .addEventListener("submit", this.addWorkOut.bind(this));
    document
      .querySelector("#workout-items")
      .addEventListener("click", this.#deleteWorkout.bind(this));
    document
      .querySelector("#meal-items")
      .addEventListener("click", this.#deleteMeals.bind(this));
    document
      .querySelector("#filter-meals")
      .addEventListener("keyup", this.#filterMeals.bind(this)); //add event listener for filtering meals
    document
      .querySelector("#filter-workouts")
      .addEventListener("keyup", this.#filterWorkouts.bind(this)); //add event listener for filtering workouts
  }

  addMeal(e) {
    e.preventDefault();
    const mealName = document.querySelector("#meal-name");
    const mealCalories = document.querySelector("#meal-calories");
    if (mealName.value !== "" || mealCalories.value !== "") {
      if (
        Number(this.#totalCalories) + Number(mealCalories.value) >
        +this.#calorieLimit
      ) {
        console.log("You have exceeded the calorie limit!");
        return;
      }
      const meal = new Meal(mealName.value, +mealCalories.value); //create a new meal
      this.#meals.push(meal);
      this.#setStroage("meals", this.#meals);
      this.#setStroage("totalCalories", this.#totalCalories);
      this.#setStroage("calorieLimit", this.#calorieLimit);
      this.#totalCalories += +meal.calories;
      //add the meal calories to the total
      this.#showMeal(meal);
      mealName.value = "";
      mealCalories.value = "";
      new bootstrap.Collapse(document.querySelector("#collapse-meal"));
    } else {
      console.log("Please enter a meal name and calories"); //if no meal name or calories entered
    }

    this.#render();
  }

  addWorkOut(e) {
    e.preventDefault(); //prevent the form from submitting
    const workoutName = document.querySelector("#workout-name");
    const workoutCalores = document.querySelector("#workout-calories");
    if (workoutName.value !== "" && workoutCalores.value !== "") {
      if (this.#totalCalories - workoutCalores.value < 0) {
        console.log("You have exceeded the calorie limit!");
        return;
      } else {
        const newWorkout = new Workout(
          workoutName.value,
          +workoutCalores.value
        );
        this.#workout.push(newWorkout);
        this.#setStroage("workout", this.#workout);
        this.#setStroage("totalCalories", this.#totalCalories);
        this.#setStroage("calorieLimit", this.#calorieLimit);
        this.#totalCalories -= newWorkout.calories;
        this.#showWorkOut(newWorkout);
        workoutName.value = "";
        workoutCalores.value = "";
        new bootstrap.Collapse(document.querySelector("#collapse-workout"));
      }
    }

    this.#render();
  }

  // filter meals
  #filterMeals(e) {
    const filterValue = e.target.value.toLowerCase(); //get the value of the input and convert to lowercase
    const mealItems = document.querySelectorAll("#meal-items .card"); //get all the meal cards
    mealItems.forEach((meal) => {
      const mealName =
        meal.firstElementChild.firstElementChild.textContent.toLowerCase(); //get the meal name and convert to lowercase
      if (mealName.indexOf(filterValue) !== -1) {
        meal.style.display = "block"; //if the meal name contains the filter value, display the meal
      } else {
        meal.style.display = "none"; //if the meal name does not contain the filter value, hide the meal
      }
    }); //loop through each meal card
  }

  // filter workouts
  #filterWorkouts(e) {
    const filterValue = e.target.value.toLowerCase(); //get the value of the input and convert to lowercase
    const workoutItems = document.querySelectorAll("#workout-items .card"); //get all the workout cards
    workoutItems.forEach((workout) => {
      const workoutName =
        workout.firstElementChild.firstElementChild.textContent.toLowerCase(); //get the workout name and convert to lowercase
      if (workoutName.indexOf(filterValue) !== -1) {
        workout.style.display = "block"; //if the workout name contains the filter value, display the workout
      } else {
        workout.style.display = "none"; //if the workout name does not contain the filter value, hide the workout
      }
    }); //loop through each workout card
  }

  // delete workout
  #deleteWorkout(e) {
    if (e.target.classList.contains("delete")) {
      const workoutId = e.target.parentElement.parentElement.parentElement.id;
      this.#workout = this.#workout.filter(
        (workout) => workout.id !== workoutId
      );
      this.#totalCalories += +e.target.previousElementSibling.textContent;
      e.target.parentElement.parentElement.parentElement.remove();
      this.#setStroage("workout", this.#workout); //update the workout in storage
      this.#setStroage("totalCalories", this.#totalCalories); //update the total calories in storage
      this.#setStroage("calorieLimit", this.#calorieLimit); //update the calorie limit in storage
      this.#render();
    }
  }

  #deleteMeals(e) {
    console.log(e.target);
    if (e.target.classList.contains("delete")) {
      const mealId = e.target.parentElement.parentElement.parentElement.id;
      this.#meals = this.#meals.filter((meal) => meal.id !== mealId);
      this.#totalCalories -= +e.target.previousElementSibling.textContent;
      e.target.parentElement.parentElement.parentElement.remove();
      this.#setStroage("meals", this.#meals); //update the meals in storage
      this.#setStroage("totalCalories", this.#totalCalories); //update the total calories in storage
      this.#setStroage("calorieLimit", this.#calorieLimit); //update the calorie limit in storage
      this.#render();
    }
  }

  #showMeal(meal) {
    const mealItems = document.querySelector("#meal-items");
    const card = document.createElement("div");
    card.classList.add("card", "my-2");
    card.id = meal.id; //set the id of the card to the meal id
    card.innerHTML = `
              <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${meal.name}</h4>
                  <div
                    class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${meal.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark fa-2xs"></i>
                  </button>
                </div>
              </div>
            `;
    mealItems.appendChild(card); //add the meal to the meal list
  }

  #showWorkOut(workout) {
    const workoutItems = document.querySelector("#workout-items");
    const card = document.createElement("div");
    card.classList.add("card", "my-2");
    card.id = workout.id; //set the id of the card to the workout id
    card.innerHTML = `
              <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${workout.name}</h4>
                  <div
                    class="fs-1 lg bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${workout.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark fa-2xs"></i>
                  </button>
                </div>
              </div>
            `;
    workoutItems.appendChild(card);
  }

  getDetails() {
    return `Total calories consumed: ${this.#totalCalories} out of ${
      this.#calorieLimit
    } limit. the meals ${this.#meals} the workout ${this.#workout}`;
  }

  #displayCaloriesTotal() {
    document.getElementById("calories-total").textContent =
      +this.#totalCalories;
    document.getElementById("calories-limit").textContent = +this.#calorieLimit;
  }

  #displayCaloriesConsumed() {
    const caloriesConsumed = 0;
    const total = this.#meals.reduce((total, meal) => {
      total += +meal.calories;
      return total;
    }, caloriesConsumed);
    document.querySelector("#calories-consumed").textContent = total;
  }

  #displayCaloriesBurned() {
    const caloriesBured = 0;
    const totalBurned = this.#workout.reduce((total, workout) => {
      total += +workout.calories;
      return total;
    }, caloriesBured);
    document.querySelector("#calories-burned").textContent = totalBurned;
  }

  #displayCaloriesRemain() {
    const remainCalories = +(this.#calorieLimit - this.#totalCalories);
    document.querySelector("#calories-remaining").textContent = remainCalories;
  }

  #setCalorieLimit(e) {
    e.preventDefault();
    const limitInput = document.querySelector("#limit");
    if (limitInput.value === "") {
      console.log("first set the limit");
      return;
    }
    this.#calorieLimit = limitInput.value;
    limitInput.value = "";
    this.#setStroage("calorieLimit", this.#calorieLimit); //update the calorie limit in storage
    this.#render();
  }

  #resetCaloriesData() {
    this.#calorieLimit = 2000;
    this.#totalCalories = 0;
    this.#meals = [];
    this.#workout = [];
    //reset the data in storage
    this.#setStroage("calorieLimit", this.#calorieLimit);
    this.#setStroage("totalCalories", this.#totalCalories);
    this.#setStroage("meals", this.#meals);
    this.#setStroage("workout", this.#workout);
    this.#render();
    this.#clearDOM();
  }

  #calculateProgressBar() {
    const progressBar = document.querySelector("#calorie-progress");
    const percentage = (this.#totalCalories / this.#calorieLimit) * 100;
    progressBar.style.width = `${percentage}%`;
  }

  #clearDOM() {
    document.querySelector("#meal-items").innerHTML = "";
    document.querySelector("#workout-items").innerHTML = "";
  }
  #render() {
    this.#displayCaloriesTotal();
    this.#displayCaloriesConsumed();
    this.#displayCaloriesBurned();
    this.#displayCaloriesRemain();
    this.#calculateProgressBar();
    this.#setStroage("totalCalories", this.#totalCalories);
    this.#setStroage("calorieLimit", this.#calorieLimit);
    this.#setStroage("meals", this.#meals);
    this.#setStroage("workout", this.#workout);
  }

  // get stroage to persist stroage
  #setStroage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  } //end of handle storage

  // set stroage to persist data
  #getStroage(key) {
    switch (key) {
      case "calorieLimit":
        return JSON.parse(localStorage.getItem("calorieLimit")) ?? 2000;
        break;
      case "totalCalories":
        return JSON.parse(localStorage.getItem("totalCalories")) ?? 0;
        break;
      case "meals":
        return JSON.parse(localStorage.getItem("meals")) ?? [];
        break;
      case "workout":
        return JSON.parse(localStorage.getItem("workout")) ?? [];
        break;
      default:
        return "key is not valid";
        break;
    }
  }
}

class Meal {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
  }
}

class Workout {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
  }
}

// Your code here

const calorietracker = new TrackCalorie();
