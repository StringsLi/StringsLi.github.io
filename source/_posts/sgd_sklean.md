Given a set of training examples$ (x_1, y_1), \ldots, (x_n, y_n)$ where$x_i \in \mathbf{R}^m$ and $y_i \in \mathcal{R}$( $y_i \in {-1,1}$for classification), our goal is to learn a linear scoring function $f(x)=w^Tx+b$ with model parameters $w \in \mathbf{R}^m $and intercept $b∈R$. In order to make predictions for binary classification, we simply look at the sign of $f(x)$. To find the model parameters, we minimize the regularized training error given by
$$
E(w,b) = \frac{1}{n}\sum_{i=1}^{n} L(y_i, f(x_i)) + \alpha R(w)
$$
where $L$ is a loss function that measures model (mis)fit and $R$ is a regularization term (aka penalty) that penalizes model complexity; $α>0$ is a non-negative hyperparameter that controls the regularization stength.

Different choices for L entail different classifiers or regressors:

- Hinge (soft-margin): equivalent to Support Vector Classification. $L(y_i,f(x_i))=max(0,1−y_if(x_i))$.
- **Perceptron**: $L(y_i,f(x_i))=max(0,−y_if(x_i))$.
- Modified Huber: $L(y_i,f(x_i))=max(0,1−y_if(x_i))2 if y_if(x_i)>1$, and $L(y_i,f(x_i))=−4y_if(x_i)$ otherwise.
- Log: equivalent to Logistic Regression. $L(y_i,f(x_i))=log⁡(1+exp⁡(−y_if(x_i)))$.
- Least-Squares: Linear regression (Ridge or Lasso depending on R). $L(y_i,f(x_i))=\frac{1}{2}(y_i−f(x_i))^2$.
- Huber: less sensitive to outliers than least-squares. It is equivalent to least squares when $|y_i−f(x_i)|≤ε$, and $L(y_i,f(x_i))=ε|y_i−f(x_i)|−\frac{1}{2}ε^2$ otherwise.
- Epsilon-Insensitive: (soft-margin) equivalent to Support Vector Regression. $L(y_i,f(x_i))=max(0,|y_i−f(x_i)|−ε)$.

All of the above loss functions can be regarded as an upper bound on the misclassification error (Zero-one loss) as shown in the Figure below.

[![../_images/sphx_glr_plot_sgd_loss_functions_0011.png](https://scikit-learn.org/stable/_images/sphx_glr_plot_sgd_loss_functions_0011.png)](https://scikit-learn.org/stable/auto_examples/linear_model/plot_sgd_loss_functions.html)

Popular choices for the regularization term R (the `penalty` parameter) include:

> - L2 norm: $R(w) := \frac{1}{2} \sum_{j=1}^{m} w_j^2 = ||w||_2^2$
> - L1 norm: $R(w) := \sum_{j=1}^{m} |w_j|$, which leads to sparse solutions.
> - Elastic Net: $R(w) := \frac{\rho}{2} \sum_{j=1}^{n} w_j^2 +
>   (1-\rho) \sum_{j=1}^{m} |w_j|$, a convex combination of L2 and L1, where ρ is given by `1 - l1_ratio`.





Linear svr 的损失函数如下：
$$
\min_ {w, b} \frac{1}{2} w^T w + C \sum_{i=1}\max(0, |y_i - (w^T \phi(x_i) + b)| - \varepsilon),
$$
where we make use of the epsilon-insensitive loss, i.e. errors of less than ε are ignored. This is the form that is directly optimized by [`LinearSVR`](https://scikit-learn.org/stable/modules/generated/sklearn.svm.LinearSVR.html#sklearn.svm.LinearSVR).





### LinearSVC[¶](https://scikit-learn.org/stable/modules/svm.html#linearsvc)

The primal problem can be equivalently formulated as
$$
\min_ {w, b} \frac{1}{2} w^T w + C \sum_{i=1}\max(0,1 - y_i (w^T \phi(x_i) + b)),
$$
where we make use of the [hinge loss](https://en.wikipedia.org/wiki/Hinge_loss). This is the form that is directly optimized by [`LinearSVC`](https://scikit-learn.org/stable/modules/generated/sklearn.svm.LinearSVC.html#sklearn.svm.LinearSVC), but unlike the dual form, this one does not involve inner products between samples, so the famous kernel trick cannot be applied. This is why only the linear kernel is supported by [`LinearSVC`](https://scikit-learn.org/stable/modules/generated/sklearn.svm.LinearSVC.html#sklearn.svm.LinearSVC) (ϕ is the identity function).

